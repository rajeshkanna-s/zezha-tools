import type { ModuleResult, CheckResult } from '../../../types/seoAnalyser';

const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export async function analyzePerformance(url: string): Promise<ModuleResult> {
  const apiUrl = `${PSI_API}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`;

  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(60000) });
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  const audits = data.lighthouseResult?.audits || {};
  const categories = data.lighthouseResult?.categories || {};

  const perfScore = Math.round((categories.performance?.score || 0) * 100);

  const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
  const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
  const cls = audits['cumulative-layout-shift']?.displayValue || 'N/A';
  const tbt = audits['total-blocking-time']?.displayValue || 'N/A';
  const si = audits['speed-index']?.displayValue || 'N/A';

  const getStatus = (audit: any): 'pass' | 'warn' | 'fail' => {
    if (!audit) return 'fail';
    if (audit.score >= 0.9) return 'pass';
    if (audit.score >= 0.5) return 'warn';
    return 'fail';
  };

  const checks: CheckResult[] = [
    {
      name: 'Performance Score', value: `${perfScore}/100`,
      status: perfScore >= 90 ? 'pass' : perfScore >= 50 ? 'warn' : 'fail',
      detail: perfScore >= 90 ? 'Excellent performance' : perfScore >= 50 ? 'Room for improvement' : 'Significant performance issues detected',
    },
    { name: 'First Contentful Paint', status: getStatus(audits['first-contentful-paint']), value: fcp, detail: 'Time until first content appears. Target: < 1.8s' },
    { name: 'Largest Contentful Paint', status: getStatus(audits['largest-contentful-paint']), value: lcp, detail: 'Time until main content loads. Target: < 2.5s' },
    { name: 'Cumulative Layout Shift', status: getStatus(audits['cumulative-layout-shift']), value: cls, detail: 'Visual stability score. Target: < 0.1' },
    { name: 'Total Blocking Time', status: getStatus(audits['total-blocking-time']), value: tbt, detail: 'Time main thread is blocked. Target: < 200ms' },
    { name: 'Speed Index', status: getStatus(audits['speed-index']), value: si, detail: 'How quickly content is visually displayed' },
  ];

  // Optional audits
  if (audits['uses-optimized-images']) {
    checks.push({
      name: 'Images Optimised',
      status: audits['uses-optimized-images'].score === 1 ? 'pass' : 'fail',
      value: audits['uses-optimized-images'].displayValue || (audits['uses-optimized-images'].score === 1 ? 'All optimised' : 'Not optimised'),
      detail: 'Serve images in modern formats (WebP/AVIF)',
    });
  }

  if (audits['uses-text-compression']) {
    checks.push({
      name: 'Text Compression',
      status: audits['uses-text-compression'].score === 1 ? 'pass' : 'fail',
      value: audits['uses-text-compression'].displayValue || (audits['uses-text-compression'].score === 1 ? 'Enabled' : 'Disabled'),
      detail: 'Enable GZIP/Brotli compression',
    });
  }

  if (audits['render-blocking-resources']) {
    checks.push({
      name: 'Render-blocking Resources',
      status: audits['render-blocking-resources'].score === 1 ? 'pass' : 'warn',
      value: audits['render-blocking-resources'].displayValue || '',
      detail: 'Reduce render-blocking CSS and JS',
    });
  }

  if (audits['unused-javascript']) {
    checks.push({
      name: 'Unused JavaScript',
      status: audits['unused-javascript'].score === 1 ? 'pass' : 'warn',
      value: audits['unused-javascript'].displayValue || '',
      detail: 'Remove unused JavaScript to reduce bundle size',
    });
  }

  return { module: 'Performance', score: perfScore, checks, raw: audits };
}
