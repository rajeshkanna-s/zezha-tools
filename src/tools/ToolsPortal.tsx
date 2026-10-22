import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Menu, ArrowLeft, LayoutGrid, Image as ImageIcon, Video, ArrowUpRight } from 'lucide-react';
import { ToolsLayout } from './ToolsLayout';
import { ToolsSidebar, MENU_SECTIONS } from './ToolsSidebar';
import { useCustomTools } from '@/hooks/useCustomTools';
import { activityTracker } from '@/services/ActivityTracker';
import { ToolsHome } from './ToolsHome';
import { SectionDashboard } from './SectionDashboard';
import { ToolsDomainLanding, TOOL_DOMAINS } from './ToolsDomainLanding';
import { CONVERTORS_TOOLS, BUSINESS_TAX_TOOLS, LOANS_EMI_TOOLS, INVESTMENTS_TOOLS, UTILITIES_TOOLS, DEV_TOOLKIT_TOOLS, RAW_DATA_TOOLS } from './dashboardData';
import { getToolMetadata } from '@/services/toolMetadata';

const LifeDecisionSimulatorPage = React.lazy(() => import('./life-decision/LifeDecisionSimulatorPage').then(m => ({ default: m.LifeDecisionSimulatorPage })));

const StartupNameCheckerPage = React.lazy(() => import('./startup-name-checker/StartupNameCheckerPage').then(m => ({ default: m.StartupNameCheckerPage })));
const GiftBudgetPlannerPage = React.lazy(() => import('./gift-budget-planner/GiftBudgetPlannerPage').then(m => ({ default: m.GiftBudgetPlannerPage })));
const RentVsBuyCalculatorPage = React.lazy(() => import('./rent-vs-buy-calculator/RentVsBuyCalculatorPage').then(m => ({ default: m.RentVsBuyCalculatorPage })));
const MarriageBudgetPlannerPage = React.lazy(() => import('./marriage-budget-planner/MarriageBudgetPlannerPage').then(m => ({ default: m.MarriageBudgetPlannerPage })));
const UnitConverterPage = React.lazy(() => import('./unit-converter/UnitConverterPage').then(m => ({ default: m.UnitConverterPage })));
const LogoCreatorPage = React.lazy(() => import('./logo/LogoCreator').then(m => ({ default: m.LogoCreator })));
const EventPageCreatorPage = React.lazy(() => import('./eventpage/EventPageCreator').then(m => ({ default: m.EventPageCreator })));
const InvitationCreatorPage = React.lazy(() => import('./invitation/InvitationCreator').then(m => ({ default: m.InvitationCreator })));

const SubscriptionOptimizerPage = React.lazy(() => import('./subscription-optimizer/SubscriptionOptimizerPage').then(m => ({ default: m.SubscriptionOptimizerPage })));
const DecisionMatrixPage = React.lazy(() => import('./decision-matrix/DecisionMatrixPage').then(m => ({ default: m.DecisionMatrixPage })));
const TimeBoxerPage = React.lazy(() => import('./time-boxer/TimeBoxerPage').then(m => ({ default: m.TimeBoxerPage })));
const FireCalculatorPage = React.lazy(() => import('./fire-calculator/FireCalculatorPage').then(m => ({ default: m.FireCalculatorPage })));
const FitnessPlannerPage = React.lazy(() => import('./fitness-planner/FitnessPlannerPage').then(m => ({ default: m.FitnessPlannerPage })));
const BodyFatCalculatorPage = React.lazy(() => import('./body-fat-calculator/BodyFatCalculatorPage').then(m => ({ default: m.BodyFatCalculatorPage })));

const ImageSearchDownloader = React.lazy(() => import('../APIs/getImages'));
const VideoSearchDownloader = React.lazy(() => import('../APIs/getVideo'));

// Govt Scheme Finder
import { GovtSchemeFinder } from './govt-schemes/GovtSchemeFinder';
import { ProductsPage } from './ProductsPage';

// Convertors
import { ImageToPdf } from './ImageToPdf';
import { CompressPdf } from './CompressPdf';
import { CompressImage } from './CompressImage';
import { MergePdf } from './MergePdf';
import { PdfToImage } from './PdfToImage';
import { WordToPdf } from './WordToPdf';
import { ImageToText } from './ImageToText';
import { SplitPdf } from './SplitPdf';
import { OrganizePdf } from './OrganizePdf';
import { HtmlToPdf } from './HtmlToPdf';
import { CropPdf } from './CropPdf';
import { DeletePdfPages } from './DeletePdfPages';
import { EditPdf } from './EditPdf';

// Calculators - Kept Sections (Business & Tax, Loans & EMI, Investments, Utilities)
import { CurrencyCalculator } from './calculators/CurrencyCalculator';
import { EmiCalculator } from './calculators/EmiCalculator';
import { DobCalculator } from './calculators/DobCalculator';
import { FdCalculator } from './calculators/FdCalculator';
import { FindDayCalculator } from './calculators/FindDayCalculator';
import { LoanCalculator } from './calculators/LoanCalculator';
import { LoanCompareCalculator } from './calculators/LoanCompareCalculator';
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { OldRegimeTaxCalculator } from './calculators/OldRegimeTaxCalculator';
import { NewRegimeTaxCalculator } from './calculators/NewRegimeTaxCalculator';
import { TaxCompareCalculator } from './calculators/TaxCompareCalculator';
import { RdCalculator } from './calculators/RdCalculator';
import { SipCalculator } from './calculators/SipCalculator';
import { PreciousMetalsCalculator } from './calculators/PreciousMetalsCalculator';
import { TdsCalculator } from './calculators/TdsCalculator';
import { ValueOfPercentageCalculator } from './calculators/ValueOfPercentageCalculator';
import { ProfitLossCalculator } from './calculators/ProfitLossCalculator';
import { RoiCalculator } from './calculators/RoiCalculator';
import { BreakEvenCalculator } from './calculators/BreakEvenCalculator';
import { BusinessValuationCalculator } from './calculators/BusinessValuationCalculator';
import { IncomeTaxEstimator } from './calculators/IncomeTaxEstimator';
import { GstVatCalculator } from './calculators/GstVatCalculator';
import { DtiCalculator } from './calculators/DtiCalculator';
import { LtvCalculator } from './calculators/LtvCalculator';
import { StandardCalculator } from './calculators/StandardCalculator';

// Global Settings & Profile
import { GlobalSettings } from './settings/GlobalSettings';

// Developer Toolkit
import { JsonFormatter } from './dev-toolkit/JsonFormatter';
import { JsonMinifier } from './dev-toolkit/JsonMinifier';
import { JsonValidator } from './dev-toolkit/JsonValidator';
import { JsonComparator } from './dev-toolkit/JsonComparator';
import { JsonToCsv } from './dev-toolkit/JsonToCsv';
import { JsonToXml } from './dev-toolkit/JsonToXml';
import { JsonPathFinder } from './dev-toolkit/JsonPathFinder';
import { JsonFlattener } from './dev-toolkit/JsonFlattener';
import { TextDiffChecker } from './dev-toolkit/TextDiffChecker';
import { CodeDiffChecker } from './dev-toolkit/CodeDiffChecker';
import { FileContentComparator } from './dev-toolkit/FileContentComparator';
import { DuplicateLineFinder } from './dev-toolkit/DuplicateLineFinder';
import { WordFrequencyCounter } from './dev-toolkit/WordFrequencyCounter';
import { Base64Tool } from './dev-toolkit/Base64Tool';
import { JwtDecoder } from './dev-toolkit/JwtDecoder';
import { UrlEncoderDecoder } from './dev-toolkit/UrlEncoderDecoder';
import { ImageToBase64Tool } from './dev-toolkit/ImageToBase64Tool';
import { SqlFormatter } from './dev-toolkit/SqlFormatter';
import { CsvToJson } from './dev-toolkit/CsvToJson';
import { StringCaseConverter } from './dev-toolkit/StringCaseConverter';
import { UnixTimestampConverter } from './dev-toolkit/UnixTimestampConverter';
import { HashGenerator } from './dev-toolkit/HashGenerator';
import { PasswordStrengthChecker } from './dev-toolkit/PasswordStrengthChecker';
import { UuidGenerator } from './dev-toolkit/UuidGenerator';
import { RandomTokenGenerator } from './dev-toolkit/RandomTokenGenerator';
import { SslCertChecker } from './dev-toolkit/SslCertChecker';
import { ColorConverter } from './dev-toolkit/ColorConverter';
import { RegexTester } from './dev-toolkit/RegexTester';
import { CronExpressionBuilder } from './dev-toolkit/CronExpressionBuilder';
import { CodeSyntaxChecker } from './dev-toolkit/CodeSyntaxChecker';

// Raw Data
import { RawDataIndianStates } from './raw-data/RawDataIndianStates';
import { RawDataIndianCities } from './raw-data/RawDataIndianCities';
import { RawDataIndianColleges } from './raw-data/RawDataIndianColleges';
import { RawDataPinCodes } from './raw-data/RawDataPinCodes';
import { RawDataDistricts } from './raw-data/RawDataDistricts';
import { RawDataParliament } from './raw-data/RawDataParliament';
import { RawDataHolidays } from './raw-data/RawDataHolidays';
import { RawDataBanks } from './raw-data/RawDataBanks';
import { RawDataGSTCodes } from './raw-data/RawDataGSTCodes';
import { RawDataTaxSlabs } from './raw-data/RawDataTaxSlabs';
import { RawDataStockMarket } from './raw-data/RawDataStockMarket';
import { RawDataIndianCars } from './raw-data/RawDataIndianCars';
import { RawDataTdsRates } from './raw-data/RawDataTdsRates';
import { RawDataProfTax } from './raw-data/RawDataProfTax';
import { RawDataMinWages } from './raw-data/RawDataMinWages';
import { RawDataDepreciation } from './raw-data/RawDataDepreciation';
import { RawDataRbiRates } from './raw-data/RawDataRbiRates';
import { RawDataGstRates } from './raw-data/RawDataGstRates';
import { RawDataSection80 } from './raw-data/RawDataSection80';
import { RawDataCii } from './raw-data/RawDataCii';
import { RawDataItrForms } from './raw-data/RawDataItrForms';
import { RawDataComplianceDates } from './raw-data/RawDataComplianceDates';
import { RawDataInterestPenalty } from './raw-data/RawDataInterestPenalty';
import { RawDataAuditLimits } from './raw-data/RawDataAuditLimits';
import { RawDataEpfRates } from './raw-data/RawDataEpfRates';
import { RawDataLeaveRules } from './raw-data/RawDataLeaveRules';
import { RawDataGratuityRules } from './raw-data/RawDataGratuityRules';
import { RawDataBankFdRates } from './raw-data/RawDataBankFdRates';
import { RawDataStatutoryDueDates } from './raw-data/RawDataStatutoryDueDates';
import { RawDataDashboard } from './raw-data/RawDataDashboard';

interface ToolsPortalProps {
  onHome?: () => void;
  onInvoice?: () => void;
  onBankStatement?: () => void;
  onPayInPayOut?: () => void;
  onSubscribe?: () => void;
  onInvitation?: () => void;
  onEventPage?: () => void;
  onLogoCreator?: () => void;
  onAtsAnalyser?: () => void;
  onEbookCreator?: () => void;
  /** From global search: tool to auto-select when portal mounts/updates */
  pendingToolSelect?: { toolId: string; sectionId: string } | null;
  /** Callback to clear pending tool after it has been consumed */
  onPendingToolConsumed?: () => void;
  /** Default domain to auto-select on mount (from Default Start Page setting) */
  defaultDomain?: string | null;
  /** Callback to clear default domain after it has been consumed */
  onDefaultDomainConsumed?: () => void;
}

export const TOOL_COMPONENTS: Record<string, React.FC<any>> = {
  // Get Img/Video
  'image-downloader': ImageSearchDownloader,
  'video-downloader': VideoSearchDownloader,
  // Convertors
  'image-to-pdf': ImageToPdf,
  'compress-pdf': CompressPdf,
  'compress-image': CompressImage,
  'merge-pdf': MergePdf,
  'pdf-to-image': PdfToImage,
  'word-to-pdf': WordToPdf,
  'image-to-text': ImageToText,
  'split-pdf': SplitPdf,
  'organize-pdf': OrganizePdf,
  'html-to-pdf': HtmlToPdf,
  'crop-pdf': CropPdf,
  'delete-pdf-pages': DeletePdfPages,
  'edit-pdf': EditPdf,
  // Business & Tax
  'profit-loss-calculator': ProfitLossCalculator,
  'roi-calculator': RoiCalculator,
  'break-even-calculator': BreakEvenCalculator,
  'income-tax-estimator': IncomeTaxEstimator,
  'old-regime-tax': OldRegimeTaxCalculator,
  'new-regime-tax': NewRegimeTaxCalculator,
  'tax-compare': TaxCompareCalculator,
  'gst-vat-calculator': GstVatCalculator,
  'tds-calculator': TdsCalculator,
  'business-valuation': BusinessValuationCalculator,
  // Loans & EMI
  'loan-calculator': LoanCalculator,
  'emi-calculator': EmiCalculator,
  'loan-compare': LoanCompareCalculator,
  'dti-calculator': DtiCalculator,
  'ltv-calculator': LtvCalculator,
  'standard-calculator': StandardCalculator,
  // Investments
  'fd-calculator': FdCalculator,
  'rd-calculator': RdCalculator,
  'sip-calculator': SipCalculator,
  'precious-metals-calculator': PreciousMetalsCalculator,
  // Utilities
  'currency-calculator': CurrencyCalculator,
  'percentage-calculator': PercentageCalculator,
  'value-of-percentage': ValueOfPercentageCalculator,
  'dob-calculator': DobCalculator,
  'find-day-calculator': FindDayCalculator,
  'global-settings': GlobalSettings,
  'subscription-optimizer': SubscriptionOptimizerPage,
  'decision-matrix': DecisionMatrixPage,
  'time-boxer': TimeBoxerPage,
  'fire-calculator': FireCalculatorPage,
  'fitness-nutrition-planner': FitnessPlannerPage,
  'body-fat-calculator': BodyFatCalculatorPage,
  'startup-name-checker': StartupNameCheckerPage,
  'festival-gift-planner': GiftBudgetPlannerPage,
  'rent-vs-buy-calculator': RentVsBuyCalculatorPage,
  'marriage-budget-planner': MarriageBudgetPlannerPage,
  'unit-converter': UnitConverterPage,
  'products': ProductsPage,
  'govt-scheme-finder': GovtSchemeFinder,
  'invitation-creator': InvitationCreatorPage,
  'event-page-creator': EventPageCreatorPage,
  'logo-creator': LogoCreatorPage,
  'life-decision-simulator': LifeDecisionSimulatorPage,
  // Developer Toolkit
  'dev-json-formatter': JsonFormatter,
  'dev-json-minifier': JsonMinifier,
  'dev-json-validator': JsonValidator,
  'dev-json-comparator': JsonComparator,
  'dev-json-to-csv': JsonToCsv,
  'dev-json-to-xml': JsonToXml,
  'dev-json-path': JsonPathFinder,
  'dev-json-flattener': JsonFlattener,
  'dev-text-diff': TextDiffChecker,
  'dev-code-diff': CodeDiffChecker,
  'dev-file-compare': FileContentComparator,
  'dev-duplicate-finder': DuplicateLineFinder,
  'dev-word-frequency': WordFrequencyCounter,
  'dev-base64': Base64Tool,
  'dev-jwt-decoder': JwtDecoder,
  'dev-url-encoder': UrlEncoderDecoder,
  'dev-image-base64': ImageToBase64Tool,
  'dev-sql-formatter': SqlFormatter,
  'dev-csv-to-json': CsvToJson,
  'dev-string-case': StringCaseConverter,
  'dev-unix-timestamp': UnixTimestampConverter,
  'dev-hash-generator': HashGenerator,
  'dev-password-checker': PasswordStrengthChecker,
  'dev-uuid-generator': UuidGenerator,
  'dev-token-generator': RandomTokenGenerator,
  'dev-ssl-checker': SslCertChecker,
  'dev-color-converter': ColorConverter,
  // Raw Data
  'indian-states-cities': RawDataIndianStates,
  'indian-cities': RawDataIndianCities,
  'indian-colleges': RawDataIndianColleges,
  'indian-pin-codes': RawDataPinCodes,
  'indian-districts': RawDataDistricts,
  'indian-parliament': RawDataParliament,
  'indian-holidays': RawDataHolidays,
  'indian-banks': RawDataBanks,
  'gst-state-codes': RawDataGSTCodes,
  'india-tax-slabs': RawDataTaxSlabs,
  'indian-stock-market': RawDataStockMarket,
  'indian-cars': RawDataIndianCars,
  'tds-rate-chart': RawDataTdsRates,
  'professional-tax': RawDataProfTax,
  'minimum-wages': RawDataMinWages,
  'depreciation-rates': RawDataDepreciation,
  'rbi-rates-history': RawDataRbiRates,
  'gst-rate-finder': RawDataGstRates,
  'section-80-deductions': RawDataSection80,
  'cost-inflation-index': RawDataCii,
  'itr-forms-guide': RawDataItrForms,
  'compliance-due-dates': RawDataComplianceDates,
  'interest-penalty-rates': RawDataInterestPenalty,
  'audit-threshold-limits': RawDataAuditLimits,
  'epf-interest-rates': RawDataEpfRates,
  'hr-leave-rules': RawDataLeaveRules,
  'gratuity-rules': RawDataGratuityRules,
  'bank-fd-rates': RawDataBankFdRates,
  'statutory-due-dates': RawDataStatutoryDueDates,
};

// Error Boundary to catch runtime crashes in tool components
class ToolErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h3 style={{ color: '#dc2626', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Tool failed to load</h3>
          <pre style={{ background: '#fef2f2', color: '#991b1b', padding: 12, borderRadius: 8, fontSize: 12, textAlign: 'left', overflow: 'auto', maxHeight: 200 }}>
            {this.state.error.message}{'\n'}{this.state.error.stack}
          </pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 12, padding: '6px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Build a lookup: toolId → { sectionId, sectionLabel }
const TOOL_TO_SECTION: Record<string, { sectionId: string; sectionLabel: string }> = {};
MENU_SECTIONS.forEach(section => {
  section.items.forEach(item => {
    TOOL_TO_SECTION[item.id] = { sectionId: section.id, sectionLabel: section.label };
  });
});


const GET_IMG_VIDEO_TOOLS = [
  { id: 'image-downloader', icon: ImageIcon, title: 'Image Downloader', desc: 'Search and download free high-quality images from Pexels', color: 'bg-pink-500' },
  { id: 'video-downloader', icon: Video, title: 'Video Downloader', desc: 'Search and download free high-quality videos from Pexels', color: 'bg-fuchsia-500' },
];

// Helper to parse route from current window.location (pathname + fallback search params)
function parseCurrentRoute(): { sectionId: string; toolId: string | null } {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const segments = pathname ? pathname.split('/') : [];

  const standaloneSections = ['home', 'govt-scheme-finder', 'invitation-creator', 'event-page-creator', 'logo-creator', 'products', 'life-decision-simulator'];

  // 1. Two segments: e.g. /investments/precious-metals-calculator or /tools/precious-metals-calculator
  if (segments.length >= 2) {
    const [first, second] = segments;
    if (first === 'tools') {
      const toolId = second;
      const sectionInfo = TOOL_TO_SECTION[toolId];
      return { sectionId: sectionInfo?.sectionId || 'home', toolId };
    }
    return { sectionId: first, toolId: second };
  }

  // 2. Single segment: e.g. /precious-metals-calculator or /investments or /govt-scheme-finder
  if (segments.length === 1) {
    const slug = segments[0];

    // If slug matches a known tool in TOOL_TO_SECTION
    if (TOOL_TO_SECTION[slug]) {
      return { sectionId: TOOL_TO_SECTION[slug].sectionId, toolId: slug };
    }

    // If slug matches a known section in MENU_SECTIONS
    const matchingSection = MENU_SECTIONS.find(s => s.id === slug);
    if (matchingSection) {
      return { sectionId: slug, toolId: null };
    }

    if (standaloneSections.includes(slug)) {
      return { sectionId: slug, toolId: null };
    }

    if (TOOL_COMPONENTS[slug]) {
      const sectionInfo = TOOL_TO_SECTION[slug];
      return { sectionId: sectionInfo?.sectionId || 'utilities', toolId: slug };
    }
  }

  // 3. Fallback to query params if someone navigated with old ?tool=...&section=...
  const params = new URLSearchParams(window.location.search);
  const qTool = params.get('tool');
  const qSection = params.get('section');
  if (qTool) {
    const sectionInfo = TOOL_TO_SECTION[qTool];
    return { sectionId: sectionInfo?.sectionId || qSection || 'home', toolId: qTool };
  }
  if (qSection && qSection !== 'home') {
    return { sectionId: qSection, toolId: null };
  }

  return { sectionId: 'home', toolId: null };
}

// Compute the clean target URL pathname
function getTargetUrl(sectionId: string, toolId: string | null): string {
  const standaloneSections = ['home', 'govt-scheme-finder', 'invitation-creator', 'event-page-creator', 'logo-creator', 'products', 'life-decision-simulator'];
  if (toolId) {
    if (standaloneSections.includes(toolId)) {
      return `/${toolId}`;
    }
    const sec = TOOL_TO_SECTION[toolId]?.sectionId || (sectionId !== 'home' ? sectionId : 'tools');
    return `/${sec}/${toolId}`;
  }
  if (sectionId && sectionId !== 'home') {
    return `/${sectionId}`;
  }
  return '/';
}

export const ToolsPortal: React.FC<ToolsPortalProps> = ({ onHome, onInvoice, onBankStatement, onPayInPayOut, onSubscribe, onInvitation, onEventPage, onLogoCreator, onAtsAnalyser, onEbookCreator, pendingToolSelect, onPendingToolConsumed, defaultDomain: defaultDomainProp, onDefaultDomainConsumed }) => {
  const initialRoute = parseCurrentRoute();
  const [activeTool, setActiveTool] = useState<string | null>(initialRoute.toolId);
  const [activeSection, setActiveSection] = useState<string>(initialRoute.sectionId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hiddenIds } = useCustomTools();
  const contentRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Sync active state with browser clean URL ──
  useEffect(() => {
    const targetUrl = getTargetUrl(activeSection, activeTool);
    if (window.location.pathname !== targetUrl || window.location.search) {
      window.history.pushState({ sectionId: activeSection, toolId: activeTool }, '', targetUrl);
    }
  }, [activeTool, activeSection]);

  // ── Support browser Back/Forward navigation ──
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setActiveTool(route.toolId);
      setActiveSection(route.sectionId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Dynamic SEO Title, Meta Description, Keywords, Canonical & Schema.org JSON-LD ──
  useEffect(() => {
    const targetUrl = getTargetUrl(activeSection, activeTool);
    const fullCanonicalUrl = `https://zezhatools.com${targetUrl === '/' ? '' : targetUrl}`;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (activeTool) {
      const toolMeta = getToolMetadata(activeTool);
      const title = toolMeta ? `${toolMeta.title} — Zezha Tools` : `${activeTool} — Zezha Tools`;
      document.title = title;

      const desc = toolMeta
        ? toolMeta.description
        : `Use the free online ${activeTool} on Zezha Tools. 100% browser-based, secure, and client-side processing with zero server uploads.`;
      setMetaTag('name', 'description', desc);

      const keywords = toolMeta
        ? toolMeta.keywords.join(', ')
        : `${activeTool}, free online calculator, web tools, zezha tools`;
      setMetaTag('name', 'keywords', keywords);

      // Open Graph Tags
      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', desc);
      setMetaTag('property', 'og:url', fullCanonicalUrl);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:site_name', 'Zezha Tools');
      setMetaTag('property', 'og:image', 'https://my--files.s3.us-east-1.amazonaws.com/Logo/ZEZHA-only-LOGO-PNG.png');

      // Twitter Cards
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', title);
      setMetaTag('name', 'twitter:description', desc);
      setMetaTag('name', 'twitter:image', 'https://my--files.s3.us-east-1.amazonaws.com/Logo/ZEZHA-only-LOGO-PNG.png');

      // Schema.org WebApplication JSON-LD
      let scriptTag = document.getElementById('tool-structured-data') as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'tool-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": toolMeta?.shortTitle || toolMeta?.title || activeTool,
        "alternateName": toolMeta?.title,
        "url": fullCanonicalUrl,
        "description": desc,
        "applicationCategory": toolMeta?.category || "UtilityApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "keywords": keywords,
        "featureList": toolMeta?.features || []
      };
      scriptTag.textContent = JSON.stringify(schemaData);

    } else if (activeSection && activeSection !== 'home') {
      const sectionMeta = MENU_SECTIONS.find(s => s.id === activeSection);
      const title = sectionMeta ? `${sectionMeta.label} Tools & Calculators — Zezha Tools` : `${activeSection} — Zezha Tools`;
      document.title = title;

      const desc = `Explore free online ${sectionMeta?.label || activeSection} utilities, calculators, and tools on Zezha Tools. 100% private, browser-based tools with zero data uploaded.`;
      setMetaTag('name', 'description', desc);

      const keywords = `${sectionMeta?.label || activeSection}, online calculators, web utilities, free tools, zezha tools`;
      setMetaTag('name', 'keywords', keywords);

      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', desc);
      setMetaTag('property', 'og:url', fullCanonicalUrl);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:site_name', 'Zezha Tools');

      setMetaTag('name', 'twitter:title', title);
      setMetaTag('name', 'twitter:description', desc);

      // Cleanup tool-specific schema on category page
      const scriptTag = document.getElementById('tool-structured-data');
      if (scriptTag) scriptTag.remove();

    } else {
      document.title = "Zezha Tools — Free Web Utilities, Calculators & PDF Tools";
      const desc = "100+ free browser-based web utilities, gold & silver rates (IBJA), loan EMI calculators, GST estimators, PDF converters, and developer tools. 100% private and client-side.";
      setMetaTag('name', 'description', desc);
      setMetaTag('name', 'keywords', "gold rate today, emi calculator, gst calculator, image to pdf, pdf compressor, merge pdf, income tax calculator, unit converter, age calculator, developer tools, json formatter, jwt decoder, zezha tools");

      setMetaTag('property', 'og:title', "Zezha Tools — Free Web Utilities, Calculators & PDF Tools");
      setMetaTag('property', 'og:description', desc);
      setMetaTag('property', 'og:url', fullCanonicalUrl);

      const scriptTag = document.getElementById('tool-structured-data');
      if (scriptTag) scriptTag.remove();
    }

    // Canonical link update
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullCanonicalUrl);
  }, [activeTool, activeSection]);

  // Scroll content area to top when switching tools or sections
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTool, activeSection]);

  // ── Auto-select tool from global search ──
  useEffect(() => {
    if (pendingToolSelect) {
      setActiveSection(pendingToolSelect.sectionId);
      setActiveTool(pendingToolSelect.toolId);
      onPendingToolConsumed?.();
    }
  }, [pendingToolSelect, onPendingToolConsumed]);

  const handleSelectTool = (toolId: string) => {
    const standaloneSections = ['home', 'products', 'govt-scheme-finder', 'invitation-creator', 'event-page-creator', 'logo-creator'];
    if (standaloneSections.includes(toolId)) {
      handleSelectSection(toolId);
      return;
    }

    const sectionInfo = TOOL_TO_SECTION[toolId];
    if (sectionInfo) {
      setActiveSection(sectionInfo.sectionId);
    }
    setActiveTool(toolId);

    const toolMeta = MENU_SECTIONS.flatMap(s => s.items).find(i => i.id === toolId);
    activityTracker.trackUsage(toolId, toolMeta?.label || toolId, sectionInfo?.sectionId, sectionInfo?.sectionLabel);
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setActiveTool(null);
  };

  const renderContent = () => {
    if (activeTool && TOOL_COMPONENTS[activeTool]) {
      const ToolComponent = TOOL_COMPONENTS[activeTool] as any;
      return (
        <div key={activeTool} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <ToolErrorBoundary>
              <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading...</div>}>
                <ToolComponent />
              </Suspense>
            </ToolErrorBoundary>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'home':
        return <ToolsHome onSelectTool={handleSelectTool} onSelectSection={handleSelectSection} />;
      case 'convertors':
        return <SectionDashboard sectionId="convertors" title="Convertors & PDF Tools" subtitle="Fast, secure, browser-based document utilities" tools={CONVERTORS_TOOLS} onSelectTool={handleSelectTool} />;
      case 'business-tax':
        return <SectionDashboard sectionId="business-tax" title="Business & Tax Calculators" subtitle="Accurate Indian tax estimation & business valuation" tools={BUSINESS_TAX_TOOLS} onSelectTool={handleSelectTool} />;
      case 'loans-emi':
        return <SectionDashboard sectionId="loans-emi" title="Loans & EMI Calculators" subtitle="Smart debt planning, EMI & loan comparisons" tools={LOANS_EMI_TOOLS} onSelectTool={handleSelectTool} />;
      case 'investments':
        return <SectionDashboard sectionId="investments" title="Investments & Wealth" subtitle="Live IBJA gold & silver rates, SIP, FD & RD calculators" tools={INVESTMENTS_TOOLS} onSelectTool={handleSelectTool} />;
      case 'utilities':
        return <SectionDashboard sectionId="utilities" title="Daily Utilities" subtitle="Universal unit converters, currency & productivity tools" tools={UTILITIES_TOOLS} onSelectTool={handleSelectTool} />;
      case 'dev-toolkit':
        return <SectionDashboard sectionId="dev-toolkit" title="Developer Toolkit" subtitle="Formatters, encoders, diff checkers & developer utilities" tools={DEV_TOOLKIT_TOOLS} onSelectTool={handleSelectTool} />;
      case 'raw-data':
        return <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Raw Data...</div>}><RawDataDashboard onSelectTool={handleSelectTool} /></Suspense>;
      case 'get-img-video':
        return <SectionDashboard sectionId="get-img-video" title="Image & Video Downloader" subtitle="Search and download high-resolution assets" tools={GET_IMG_VIDEO_TOOLS} onSelectTool={handleSelectTool} />;
      case 'products':
        return <ProductsPage />;
      case 'govt-scheme-finder':
        return <GovtSchemeFinder />;
      case 'invitation-creator':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Invitation Creator...</div>}>
                <InvitationCreatorPage />
              </Suspense>
            </div>
          </div>
        );
      case 'event-page-creator':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Event Page Creator...</div>}>
                <EventPageCreatorPage />
              </Suspense>
            </div>
          </div>
        );
      case 'logo-creator':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Logo Creator...</div>}>
                <LogoCreatorPage />
              </Suspense>
            </div>
          </div>
        );
      case 'life-decision-simulator':
        return <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Life Decision Simulator...</div>}><LifeDecisionSimulatorPage embedded /></Suspense>;
      case 'startup-name-checker':
        return (<div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Startup Name Checker...</div>}><StartupNameCheckerPage /></Suspense></div></div>);
      case 'festival-gift-planner':
        return (<div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Gift Budget Planner...</div>}><GiftBudgetPlannerPage /></Suspense></div></div>);
      case 'rent-vs-buy-calculator':
        return (<div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Rent vs Buy Calculator...</div>}><RentVsBuyCalculatorPage /></Suspense></div></div>);
      case 'marriage-budget-planner':
        return (<div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Marriage Budget Planner...</div>}><MarriageBudgetPlannerPage /></Suspense></div></div>);
      case 'unit-converter':
        return (<div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Universal Unit Converter...</div>}><UnitConverterPage onBack={() => handleSelectSection('utilities')} /></Suspense></div></div>);
      default:
        return <ToolsHome onSelectTool={handleSelectTool} onSelectSection={handleSelectSection} />;
    }
  };

  return (
    <ToolsLayout onHome={onHome || (() => {})}>
      <div className="flex flex-col h-full">
        {/* Mobile Header Bar */}
        {isMobile && (
          <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-20 mobile-header-shadow">
            <div className="flex items-center gap-2.5">
              {(activeTool || activeSection !== 'home') && (
                <button
                  onClick={() => {
                    if (activeTool) {
                      setActiveTool(null);
                    } else {
                      setActiveSection('home');
                    }
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <span className="font-extrabold text-sm bg-gradient-to-r from-primary via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                {activeTool ? (MENU_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTool)?.label || 'Tool') : 'Zezha Tools'}
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </header>
        )}

        <div className="flex flex-1 min-h-0 relative">
          <ToolsSidebar
            activeTool={activeTool}
            activeSection={activeSection}
            onSelectTool={handleSelectTool}
            onSelectSection={handleSelectSection}
            isSubscribed={true}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div ref={contentRef} className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden tool-container-wrap">
            {renderContent()}
          </div>
        </div>
      </div>
    </ToolsLayout>
  );
};
