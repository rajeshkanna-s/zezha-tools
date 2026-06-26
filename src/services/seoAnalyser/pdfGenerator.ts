import jsPDF from 'jspdf';
import type { AnalysisResult, CheckResult } from '../../types/seoAnalyser';
import { getScoreLabel } from '../../types/seoAnalyser';

function scoreColor(score: number): [number, number, number] {
  if (score < 40) return [239, 68, 68];
  if (score < 60) return [249, 115, 22];
  if (score < 75) return [245, 158, 11];
  if (score < 90) return [34, 197, 94];
  return [16, 185, 129];
}

function statusColor(status: string): [number, number, number] {
  if (status === 'pass') return [34, 197, 94];
  if (status === 'fail') return [239, 68, 68];
  if (status === 'warn') return [245, 158, 11];
  return [100, 116, 139];
}

function statusLabel(status: string): string {
  if (status === 'pass') return '[PASS]';
  if (status === 'fail') return '[FAIL]';
  if (status === 'warn') return '[WARN]';
  return '[INFO]';
}

/** Draw a colored status dot */
function drawStatusDot(pdf: jsPDF, x: number, y: number, status: string) {
  const [r, g, b] = statusColor(status);
  pdf.setFillColor(r, g, b);
  pdf.circle(x, y - 1.2, 1.5, 'F');
}

/** Draw a score arc circle on cover page */
function drawScoreCircle(pdf: jsPDF, x: number, y: number, radius: number, score: number, label: string) {
  const [r, g, b] = scoreColor(score);
  // Background circle
  pdf.setDrawColor(60, 70, 90);
  pdf.setLineWidth(1.5);
  pdf.circle(x, y, radius);
  // Colored circle
  pdf.setDrawColor(r, g, b);
  pdf.setLineWidth(3);
  pdf.circle(x, y, radius);
  // Score text
  pdf.setTextColor(r, g, b);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(score), x, y + 2, { align: 'center' });
  // Label
  pdf.setTextColor(180, 180, 190);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(label, x, y + radius + 6, { align: 'center' });
}

/** Ensure text doesn't exceed page, adding new page if needed */
function ensureSpace(pdf: jsPDF, y: number, needed: number, pageH: number, pageW: number, headerTitle?: string): number {
  if (y + needed > pageH - 15) {
    pdf.addPage();
    if (headerTitle) addHeader(pdf, headerTitle + ' (cont.)', pageW);
    return 30;
  }
  return y;
}

/** Sanitise text for jsPDF - remove all non-ASCII characters */
function safe(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, '-')  // en-dash, em-dash
    .replace(/[\u2018\u2019]/g, "'")  // smart quotes
    .replace(/[\u201C\u201D]/g, '"')  // smart double quotes
    .replace(/[\u2026]/g, '...')      // ellipsis
    .replace(/[\u2022]/g, '-')        // bullet
    .replace(/[^\x20-\x7E\n\r\t]/g, '') // strip all remaining non-ASCII
    .trim();
}

function addHeader(pdf: jsPDF, title: string, pageW: number) {
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ReportsIQ SEO Report', 15, 10);
  const pageNum = (pdf as any).internal.getNumberOfPages();
  pdf.text('Page ' + pageNum, pageW - 25, 10);
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(15, 12, pageW - 15, 12);

  pdf.setFontSize(14);
  pdf.setTextColor(30, 30, 60);
  pdf.setFont('helvetica', 'bold');
  pdf.text(safe(title), 15, 22);
}

/** Render a single check item and return new Y position */
function renderCheck(pdf: jsPDF, check: CheckResult, y: number, pageW: number, pageH: number, headerTitle: string): number {
  y = ensureSpace(pdf, y, 18, pageH, pageW, headerTitle);

  const leftMargin = 22;
  const maxTextW = pageW - leftMargin - 15;
  const [cr, cg, cb] = statusColor(check.status);

  // Status dot
  drawStatusDot(pdf, 17, y, check.status);

  // Status label
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(cr, cg, cb);
  pdf.text(statusLabel(check.status), leftMargin, y);

  // Check name (on same line after status label)
  const labelW = pdf.getTextWidth(statusLabel(check.status) + '  ');
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text(safe(check.name), leftMargin + labelW, y);
  y += 4.5;

  // Value (on its own line)
  if (check.value) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    const valLines = pdf.splitTextToSize(safe(check.value), maxTextW);
    pdf.text(valLines, leftMargin + 2, y);
    y += valLines.length * 3.5;
  }

  // Detail (on its own line, lighter color)
  if (check.detail) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(120, 120, 120);
    const detailLines = pdf.splitTextToSize(safe(check.detail), maxTextW);
    pdf.text(detailLines, leftMargin + 2, y);
    y += detailLines.length * 3.2 + 1;
  }

  // Separator line
  pdf.setDrawColor(235, 235, 240);
  pdf.setLineWidth(0.2);
  pdf.line(leftMargin, y, pageW - 15, y);
  y += 3;

  return y;
}

export async function generatePDFReport(result: AnalysisResult): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // ========== Page 1: Cover ==========
  pdf.setFillColor(13, 31, 60);
  pdf.rect(0, 0, pageW, pageH, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SEO ANALYSIS REPORT', pageW / 2, 50, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(safe(result.url), pageW / 2, 65, { align: 'center' });

  const dateStr = new Date(result.timestamp).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  pdf.text('Generated: ' + safe(dateStr), pageW / 2, 75, { align: 'center' });

  // Score circles
  const circleY = 120;
  const coverScores = [
    { score: result.overall, label: 'Overall' },
    { score: result.seo?.score ?? 0, label: 'SEO' },
    { score: result.performance?.score ?? 0, label: 'Performance' },
    { score: result.security?.score ?? 0, label: 'Security' },
  ];
  const gap = pageW / 5;
  coverScores.forEach((s, i) => {
    drawScoreCircle(pdf, gap * (i + 1), circleY, 15, s.score, s.label);
  });

  // All 8 module scores as a bar list below circles
  const allModules = [
    { name: 'SEO Fundamentals', score: result.seo?.score ?? 0 },
    { name: 'Performance', score: result.performance?.score ?? 0 },
    { name: 'UX & Content', score: result.ux?.score ?? 0 },
    { name: 'Keywords', score: result.keywords?.score ?? 0 },
    { name: 'Security', score: result.security?.score ?? 0 },
    { name: 'Technical Health', score: result.technical?.score ?? 0 },
    { name: 'Mobile Readiness', score: result.mobile?.score ?? 0 },
    { name: 'Social & Indexability', score: result.social?.score ?? 0 },
  ];

  let coverY = 160;
  pdf.setFontSize(8);
  allModules.forEach(m => {
    const [r, g, b] = scoreColor(m.score);
    // Label
    pdf.setTextColor(180, 180, 190);
    pdf.setFont('helvetica', 'normal');
    pdf.text(m.name, 50, coverY);
    // Score bar background
    pdf.setFillColor(40, 50, 70);
    pdf.roundedRect(105, coverY - 2.5, 60, 3.5, 1.5, 1.5, 'F');
    // Score bar fill
    pdf.setFillColor(r, g, b);
    const barW = Math.max(1, (m.score / 100) * 60);
    pdf.roundedRect(105, coverY - 2.5, barW, 3.5, 1.5, 1.5, 'F');
    // Score number
    pdf.setTextColor(r, g, b);
    pdf.setFont('helvetica', 'bold');
    pdf.text(String(m.score), 170, coverY);
    coverY += 6;
  });

  pdf.setTextColor(100, 100, 120);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Powered by ReportsIQ', pageW / 2, pageH - 15, { align: 'center' });

  // ========== Page 2: Executive Summary ==========
  pdf.addPage();
  addHeader(pdf, 'Executive Summary', pageW);

  let y = 30;
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Score: ' + result.overall + '/100 - ' + safe(getScoreLabel(result.overall)), 15, y);
  y += 12;

  // Summary table
  const modules = [
    { name: 'SEO Fundamentals', score: result.seo?.score, weight: '25%' },
    { name: 'Performance', score: result.performance?.score, weight: '20%' },
    { name: 'UX & Content', score: result.ux?.score, weight: '15%' },
    { name: 'Keywords', score: result.keywords?.score, weight: '10%' },
    { name: 'Security & Vulnerability', score: result.security?.score, weight: '15%' },
    { name: 'Technical Health', score: result.technical?.score, weight: '10%' },
    { name: 'Mobile Readiness', score: result.mobile?.score, weight: '5%' },
    { name: 'Social & Indexability', score: result.social?.score, weight: '5%' },
  ];

  // Table header
  pdf.setFillColor(240, 240, 245);
  pdf.rect(15, y, pageW - 30, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(60, 60, 60);
  pdf.text('Module', 18, y + 5.5);
  pdf.text('Weight', 110, y + 5.5);
  pdf.text('Score', 135, y + 5.5);
  pdf.text('Rating', 160, y + 5.5);
  y += 10;

  // Table rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  modules.forEach((m, idx) => {
    const s = m.score ?? 0;
    const [r, g, b] = scoreColor(s);

    // Alternating row background
    if (idx % 2 === 0) {
      pdf.setFillColor(248, 248, 252);
      pdf.rect(15, y - 1, pageW - 30, 8, 'F');
    }

    pdf.setTextColor(40, 40, 40);
    pdf.text(m.name, 18, y + 5);
    pdf.text(m.weight, 114, y + 5);
    pdf.setTextColor(r, g, b);
    pdf.setFont('helvetica', 'bold');
    pdf.text(s + '/100', 137, y + 5);
    pdf.text(safe(getScoreLabel(s)), 162, y + 5);
    pdf.setFont('helvetica', 'normal');
    y += 8;
  });

  // Quick summary stats
  y += 8;
  const totalChecks = [result.seo, result.performance, result.ux, result.keywords, result.security, result.technical, result.mobile, result.social]
    .filter(Boolean)
    .reduce((acc, m) => acc + (m?.checks.length || 0), 0);
  const totalPass = [result.seo, result.performance, result.ux, result.keywords, result.security, result.technical, result.mobile, result.social]
    .filter(Boolean)
    .reduce((acc, m) => acc + (m?.checks.filter(c => c.status === 'pass').length || 0), 0);
  const totalFail = [result.seo, result.performance, result.ux, result.keywords, result.security, result.technical, result.mobile, result.social]
    .filter(Boolean)
    .reduce((acc, m) => acc + (m?.checks.filter(c => c.status === 'fail').length || 0), 0);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 40, 40);
  pdf.text('Summary', 15, y);
  y += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(34, 197, 94);
  pdf.text(totalPass + ' checks passed', 18, y);
  pdf.setTextColor(239, 68, 68);
  pdf.text(totalFail + ' checks failed', 65, y);
  pdf.setTextColor(100, 100, 100);
  pdf.text(totalChecks + ' total checks', 110, y);
  pdf.text(result.fixPlan.length + ' fix items', 155, y);

  // ========== Pages 3-N: Module Details ==========
  const moduleResults = [
    result.seo, result.performance, result.ux, result.keywords,
    result.security, result.technical, result.mobile, result.social,
  ];

  for (const mod of moduleResults) {
    if (!mod) continue;
    pdf.addPage();
    addHeader(pdf, mod.module, pageW);

    y = 28;

    // Module score badge
    const [mr, mg, mb] = scoreColor(mod.score);
    pdf.setFillColor(mr, mg, mb);
    pdf.roundedRect(15, y - 4, 50, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Score: ' + mod.score + '/100', 17, y + 2.5);

    // Rating text
    pdf.setTextColor(mr, mg, mb);
    pdf.setFontSize(11);
    pdf.text(safe(getScoreLabel(mod.score)), 70, y + 2.5);
    y += 14;

    // Stats line
    const modPass = mod.checks.filter(c => c.status === 'pass').length;
    const modFail = mod.checks.filter(c => c.status === 'fail').length;
    const modWarn = mod.checks.filter(c => c.status === 'warn').length;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(34, 197, 94);
    pdf.text(modPass + ' passed', 18, y);
    pdf.setTextColor(245, 158, 11);
    pdf.text(modWarn + ' warnings', 50, y);
    pdf.setTextColor(239, 68, 68);
    pdf.text(modFail + ' failed', 85, y);
    y += 7;

    // Separator
    pdf.setDrawColor(220, 220, 225);
    pdf.setLineWidth(0.3);
    pdf.line(15, y, pageW - 15, y);
    y += 5;

    // Render each check
    for (const check of mod.checks) {
      y = renderCheck(pdf, check, y, pageW, pageH, mod.module);
    }
  }

  // ========== Fix Plan Pages ==========
  if (result.fixPlan.length > 0) {
    pdf.addPage();
    addHeader(pdf, '30-Day Fix Plan', pageW);
    y = 30;

    const totalImpact = result.fixPlan.reduce((a, b) => a + b.scoreImpact, 0);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Total potential score improvement: +' + totalImpact + ' points', 15, y);
    y += 8;

    let currentWeek = 0;

    for (const fix of result.fixPlan) {
      y = ensureSpace(pdf, y, 25, pageH, pageW, '30-Day Fix Plan');

      // Week heading
      if (fix.week !== currentWeek) {
        currentWeek = fix.week;
        const weekColors: Record<number, [number, number, number]> = {
          1: [239, 68, 68], 2: [245, 158, 11], 3: [34, 197, 94],
        };
        const weekNames: Record<number, string> = {
          1: 'WEEK 1 - URGENT FIXES', 2: 'WEEK 2 - IMPORTANT IMPROVEMENTS', 3: 'WEEK 3+ - ONGOING OPTIMISATION',
        };
        const [wr, wg, wb] = weekColors[currentWeek] || [100, 100, 100];
        pdf.setFillColor(wr, wg, wb);
        pdf.roundedRect(15, y - 3, pageW - 30, 7, 1.5, 1.5, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(weekNames[currentWeek] || 'WEEK ' + currentWeek, 18, y + 1.5);
        y += 9;
      }

      // Fix item card
      pdf.setFillColor(248, 248, 252);
      const cardStartY = y - 2;

      // Title
      pdf.setTextColor(30, 30, 60);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(safe(fix.title), 20, y + 1);
      y += 5;

      // Meta line
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 100, 100);
      const metaText = 'Impact: ' + fix.impact.toUpperCase() + '  |  Time: ' + safe(fix.timeEst) + '  |  Score: +' + fix.scoreImpact + ' pts';
      pdf.text(metaText, 22, y);
      y += 4;

      // Description
      if (fix.description) {
        pdf.setFontSize(7.5);
        pdf.setTextColor(80, 80, 80);
        const descLines = pdf.splitTextToSize(safe(fix.description), pageW - 42);
        pdf.text(descLines, 22, y);
        y += descLines.length * 3.2;
      }

      // Steps
      fix.steps.forEach((step, i) => {
        y = ensureSpace(pdf, y, 5, pageH, pageW, '30-Day Fix Plan');
        pdf.setFontSize(7);
        pdf.setTextColor(80, 80, 80);
        pdf.text((i + 1) + '. ' + safe(step), 24, y);
        y += 3.5;
      });

      // Card background
      pdf.setFillColor(248, 248, 252);
      // Draw background behind (we'll draw border instead since fill would cover text)
      pdf.setDrawColor(230, 230, 235);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(16, cardStartY, pageW - 32, y - cardStartY + 2, 2, 2, 'S');

      y += 5;
    }
  }

  // ========== Footer Page ==========
  pdf.addPage();
  pdf.setFillColor(13, 31, 60);
  pdf.rect(0, 0, pageW, pageH, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Generated by ReportsIQ', pageW / 2, pageH / 2 - 10, { align: 'center' });
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('reportsiq.in', pageW / 2, pageH / 2 + 5, { align: 'center' });
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 160);
  pdf.text('All data is informational only. Results are based on', pageW / 2, pageH / 2 + 18, { align: 'center' });
  pdf.text('publicly available data at the time of analysis.', pageW / 2, pageH / 2 + 23, { align: 'center' });

  // Save
  const hostname = new URL(result.url).hostname;
  const fileDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  pdf.save('SEO_Report_' + hostname + '_' + fileDateStr + '.pdf');
}
