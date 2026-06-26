import type { SecurityResult, CheckResult, ExposedFileResult, SecurityHeaderResult } from '../../../types/seoAnalyser';

const SENSITIVE_PATHS = [
  '/.git/config', '/.git/HEAD', '/.env', '/.env.local', '/.env.production',
  '/wp-config.php', '/wp-config.php.bak', '/phpinfo.php', '/info.php',
  '/admin', '/admin.php', '/administrator', '/phpmyadmin',
  '/db.php', '/database.php', '/config.php', '/configuration.php',
  '/backup.sql', '/backup.zip', '/db_backup.sql',
  '/.htaccess', '/server-status', '/web.config',
  '/readme.html', '/license.txt',
];

function getDangerLevel(path: string): 'critical' | 'high' | 'medium' {
  if (path.includes('.env') || path.includes('config') || path.includes('.git'))
    return 'critical';
  if (path.includes('php') || path.includes('backup') || path.includes('.sql'))
    return 'high';
  return 'medium';
}

async function checkExposedFiles(baseUrl: string): Promise<ExposedFileResult[]> {
  const origin = new URL(baseUrl).origin;
  const results: ExposedFileResult[] = [];

  const checks = SENSITIVE_PATHS.map(async path => {
    try {
      const res = await fetch(`${origin}${path}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        mode: 'no-cors',
      });
      // no-cors: if we get here without error, resource may exist
      // However, no-cors always gives opaque response, so we can't check status
      // Mark as potentially exposed for paths that resolve
      if (res.type === 'opaque') {
        // Can't determine — mark as safe (avoid false positives)
        results.push({ path, status: 'safe', severity: 'none' });
      } else {
        results.push({ path, status: res.ok ? 'exposed' : 'safe', severity: res.ok ? getDangerLevel(path) : 'none' });
      }
    } catch {
      results.push({ path, status: 'safe', severity: 'none' });
    }
  });

  await Promise.allSettled(checks);
  return results;
}

async function checkSecurityHeaders(url: string): Promise<SecurityHeaderResult> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    const headers: Record<string, string> = {};

    // allorigins returns headers in status.response_headers
    if (data.status?.response_headers) {
      for (const [key, val] of Object.entries(data.status.response_headers)) {
        headers[key.toLowerCase()] = String(val);
      }
    }

    return {
      hasHSTS: !!headers['strict-transport-security'],
      hasCSP: !!headers['content-security-policy'],
      hasXFrame: !!headers['x-frame-options'],
      hasXContentType: headers['x-content-type-options'] === 'nosniff',
      hasReferrerPolicy: !!headers['referrer-policy'],
      hasPermissionsPolicy: !!headers['permissions-policy'] || !!headers['feature-policy'],
      rawHeaders: headers,
    };
  } catch {
    return {
      hasHSTS: false, hasCSP: false, hasXFrame: false,
      hasXContentType: false, hasReferrerPolicy: false, hasPermissionsPolicy: false,
      rawHeaders: {},
    };
  }
}

export async function analyzeSecurity(url: string, doc: Document | null): Promise<SecurityResult> {
  const checks: CheckResult[] = [];
  let score = 0;

  const isHttps = url.startsWith('https://');

  // HTTPS
  if (isHttps) {
    score += 20;
    checks.push({ name: 'HTTPS Enforced', status: 'pass', value: 'Yes', detail: 'Site uses HTTPS — encrypted connection' });
  } else {
    checks.push({ name: 'HTTPS Enforced', status: 'fail', value: 'No', detail: 'CRITICAL: Site uses HTTP — data transmitted in plaintext' });
  }

  // Headers
  const headers = await checkSecurityHeaders(url);

  if (headers.hasHSTS) { score += 10; checks.push({ name: 'HSTS', status: 'pass', value: 'Present', detail: 'Strict-Transport-Security header forces HTTPS' }); }
  else { checks.push({ name: 'HSTS', status: 'fail', value: 'Missing', detail: 'Add HSTS header to prevent protocol downgrade attacks' }); }

  if (headers.hasCSP) { score += 10; checks.push({ name: 'Content-Security-Policy', status: 'pass', value: 'Present', detail: 'CSP prevents XSS attacks by controlling script sources' }); }
  else { checks.push({ name: 'Content-Security-Policy', status: 'fail', value: 'Missing', detail: 'No CSP header — high XSS risk' }); }

  if (headers.hasXFrame) { score += 8; checks.push({ name: 'X-Frame-Options', status: 'pass', value: 'Present', detail: 'Clickjacking protection enabled' }); }
  else { checks.push({ name: 'X-Frame-Options', status: 'fail', value: 'Missing', detail: 'Site can be embedded in iframes — clickjacking risk' }); }

  if (headers.hasXContentType) { score += 5; checks.push({ name: 'X-Content-Type-Options', status: 'pass', value: 'nosniff', detail: 'MIME type sniffing prevention enabled' }); }
  else { checks.push({ name: 'X-Content-Type-Options', status: 'warn', value: 'Missing', detail: 'Add nosniff header to prevent MIME type attacks' }); }

  if (headers.hasReferrerPolicy) { score += 5; checks.push({ name: 'Referrer-Policy', status: 'pass', value: 'Present', detail: 'Referrer information controlled' }); }
  else { checks.push({ name: 'Referrer-Policy', status: 'warn', value: 'Missing', detail: 'Set Referrer-Policy for user privacy' }); }

  if (headers.hasPermissionsPolicy) { score += 5; checks.push({ name: 'Permissions-Policy', status: 'pass', value: 'Present', detail: 'Browser feature access controlled' }); }
  else { checks.push({ name: 'Permissions-Policy', status: 'warn', value: 'Missing', detail: 'Add Permissions-Policy to control camera, mic, geo access' }); }

  // Mixed content
  let mixedContent = false;
  if (doc && isHttps) {
    const httpSrcs = doc.querySelectorAll('[src^="http:"]');
    mixedContent = httpSrcs.length > 0;
    if (mixedContent) {
      checks.push({ name: 'Mixed Content', status: 'fail', value: `${httpSrcs.length} resources`, detail: 'HTTP resources loaded on HTTPS page — browsers will block these' });
    } else {
      score += 10;
      checks.push({ name: 'Mixed Content', status: 'pass', value: 'None', detail: 'All resources loaded over HTTPS' });
    }
  }

  // Exposed files
  const exposedFiles = await checkExposedFiles(url);
  const exposed = exposedFiles.filter(f => f.status === 'exposed');
  if (exposed.length > 0) {
    checks.push({
      name: 'Exposed Sensitive Files', status: 'fail',
      value: `${exposed.length} files exposed`,
      detail: exposed.map(f => f.path).join(', '),
    });
  } else {
    score += 10;
    checks.push({ name: 'Exposed Sensitive Files', status: 'pass', value: 'None found', detail: `All ${SENSITIVE_PATHS.length} sensitive paths checked — secure` });
  }

  // External scripts
  if (doc) {
    const scripts = doc.querySelectorAll('script[src]');
    const externalScripts: string[] = [];
    const origin = new URL(url).origin;
    scripts.forEach(s => {
      const src = s.getAttribute('src') || '';
      try { if (!src.startsWith('/') && !src.startsWith(origin)) externalScripts.push(new URL(src, url).hostname); } catch { /* skip */ }
    });
    const unique = [...new Set(externalScripts)];
    if (unique.length <= 3) {
      score += 5;
      checks.push({ name: 'External Scripts', status: 'pass', value: `${unique.length} domains`, detail: unique.length === 0 ? 'No external scripts' : unique.join(', ') });
    } else {
      checks.push({ name: 'External Scripts', status: 'warn', value: `${unique.length} domains`, detail: `Each external script is a supply-chain risk: ${unique.slice(0, 5).join(', ')}` });
    }

    // jQuery version
    scripts.forEach(s => {
      const src = s.getAttribute('src') || '';
      if (src.includes('jquery')) {
        const vMatch = src.match(/jquery[.-](\d+\.\d+\.\d+)/i);
        if (vMatch) {
          const ver = vMatch[1];
          const [major, minor] = ver.split('.').map(Number);
          if (major >= 3 && minor >= 6) {
            score += 5;
            checks.push({ name: 'jQuery Version', status: 'pass', value: ver, detail: 'Up-to-date jQuery version' });
          } else {
            checks.push({ name: 'jQuery Version', status: 'warn', value: ver, detail: 'Outdated jQuery — known XSS vulnerabilities. Update to 3.6+' });
          }
        }
      }
    });
  }

  // Determine threat level
  const criticalCount = exposed.filter(f => f.severity === 'critical').length + (isHttps ? 0 : 1);
  const highCount = checks.filter(c => c.status === 'fail').length;

  let threatLevel: SecurityResult['threatLevel'] = 'secure';
  if (criticalCount > 0) threatLevel = 'critical';
  else if (highCount >= 3) threatLevel = 'high';
  else if (highCount >= 1) threatLevel = 'medium';
  else if (checks.some(c => c.status === 'warn')) threatLevel = 'low';

  const finalScore = Math.min(100, Math.round((score / 78) * 100));
  if (threatLevel === 'critical') {
    return { module: 'Security & Vulnerability', score: Math.min(finalScore, 30), checks, threatLevel, exposedFiles: exposed, headers, mixedContent };
  }

  return { module: 'Security & Vulnerability', score: finalScore, checks, threatLevel, exposedFiles: exposed, headers, mixedContent };
}
