export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info';

export interface CheckResult {
  name: string;
  status: CheckStatus;
  value: string;
  detail: string;
  score?: number;
}

export interface ModuleResult {
  module: string;
  score: number; // 0–100
  checks: CheckResult[];
  raw?: any;
}

export interface ExposedFileResult {
  path: string;
  status: 'exposed' | 'safe';
  severity: 'critical' | 'high' | 'medium' | 'none';
}

export interface SecurityHeaderResult {
  hasHSTS: boolean;
  hasCSP: boolean;
  hasXFrame: boolean;
  hasXContentType: boolean;
  hasReferrerPolicy: boolean;
  hasPermissionsPolicy: boolean;
  rawHeaders: Record<string, string>;
}

export interface SecurityResult extends ModuleResult {
  threatLevel: 'critical' | 'high' | 'medium' | 'low' | 'secure';
  exposedFiles: ExposedFileResult[];
  headers: SecurityHeaderResult;
  mixedContent: boolean;
}

export type FixWeek = 1 | 2 | 3;
export type FixUrgency = 'day1' | 'week1' | 'week2' | 'week3';
export type FixImpact = 'high' | 'medium' | 'low';

export interface FixItem {
  id: string;
  title: string;
  description: string;
  steps: string[];
  week: FixWeek;
  urgency: FixUrgency;
  impact: FixImpact;
  timeEst: string;
  scoreImpact: number;
  codeSnippet?: string;
  done: boolean;
}

export interface AnalysisResult {
  url: string;
  timestamp: Date;
  overall: number;
  seo: ModuleResult | null;
  performance: ModuleResult | null;
  ux: ModuleResult | null;
  keywords: ModuleResult | null;
  security: SecurityResult | null;
  technical: ModuleResult | null;
  mobile: ModuleResult | null;
  social: ModuleResult | null;
  fixPlan: FixItem[];
}

export type ScoreLevel = 'critical' | 'poor' | 'needs-work' | 'good' | 'excellent';

export function getScoreLevel(score: number): ScoreLevel {
  if (score < 40) return 'critical';
  if (score < 60) return 'poor';
  if (score < 75) return 'needs-work';
  if (score < 90) return 'good';
  return 'excellent';
}

export function getScoreColor(score: number): { bg: string; text: string; border: string; ring: string } {
  if (score < 40) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', ring: '#ef4444' };
  if (score < 60) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', ring: '#f97316' };
  if (score < 75) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', ring: '#f59e0b' };
  if (score < 90) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', ring: '#22c55e' };
  return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', ring: '#10b981' };
}

export function getScoreLabel(score: number): string {
  if (score < 40) return 'Critical';
  if (score < 60) return 'Poor';
  if (score < 75) return 'Needs Work';
  if (score < 90) return 'Good';
  return 'Excellent';
}
