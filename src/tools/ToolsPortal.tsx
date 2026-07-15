import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Menu, ArrowLeft, LayoutGrid, Image as ImageIcon, Video, ArrowUpRight } from 'lucide-react';
import { ToolsLayout } from './ToolsLayout';
import { ToolsSidebar, MENU_SECTIONS } from './ToolsSidebar';
import { useAuth } from '../contexts/AuthContext';
import { useCustomTools } from '@/hooks/useCustomTools';
import { activityTracker } from '@/services/ActivityTracker';
import { ToolsHome } from './ToolsHome';
import { SectionDashboard } from './SectionDashboard';
import { ToolsDomainLanding, TOOL_DOMAINS } from './ToolsDomainLanding';
import { BUSINESS_TAX_TOOLS, LOANS_EMI_TOOLS, INVESTMENTS_TOOLS, UTILITIES_TOOLS, DEV_TOOLKIT_TOOLS, RAW_DATA_TOOLS } from './dashboardData';

const LifeDecisionSimulatorPage = React.lazy(() => import('./life-decision/LifeDecisionSimulatorPage').then(m => ({ default: m.LifeDecisionSimulatorPage })));

const StartupNameCheckerPage = React.lazy(() => import('./startup-name-checker/StartupNameCheckerPage').then(m => ({ default: m.StartupNameCheckerPage })));
const GiftBudgetPlannerPage = React.lazy(() => import('./gift-budget-planner/GiftBudgetPlannerPage').then(m => ({ default: m.GiftBudgetPlannerPage })));
const RentVsBuyCalculatorPage = React.lazy(() => import('./rent-vs-buy-calculator/RentVsBuyCalculatorPage').then(m => ({ default: m.RentVsBuyCalculatorPage })));
const MarriageBudgetPlannerPage = React.lazy(() => import('./marriage-budget-planner/MarriageBudgetPlannerPage').then(m => ({ default: m.MarriageBudgetPlannerPage })));
const UnitConverterPage = React.lazy(() => import('./unit-converter/UnitConverterPage').then(m => ({ default: m.UnitConverterPage })));
const LogoCreatorPage = React.lazy(() => import('./logo/LogoCreator').then(m => ({ default: m.LogoCreator })));
const EventPageCreatorPage = React.lazy(() => import('./eventpage/EventPageCreator').then(m => ({ default: m.EventPageCreator })));
const InvitationCreatorPage = React.lazy(() => import('./invitation/InvitationCreator').then(m => ({ default: m.InvitationCreator })));

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
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { OldRegimeTaxCalculator } from './calculators/OldRegimeTaxCalculator';
import { NewRegimeTaxCalculator } from './calculators/NewRegimeTaxCalculator';
import { TaxCompareCalculator } from './calculators/TaxCompareCalculator';
import { RdCalculator } from './calculators/RdCalculator';
import { SipCalculator } from './calculators/SipCalculator';
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
  'dti-calculator': DtiCalculator,
  'ltv-calculator': LtvCalculator,
  // Investments
  'fd-calculator': FdCalculator,
  'rd-calculator': RdCalculator,
  'sip-calculator': SipCalculator,
  // Utilities
  'currency-calculator': CurrencyCalculator,
  'percentage-calculator': PercentageCalculator,
  'value-of-percentage': ValueOfPercentageCalculator,
  'dob-calculator': DobCalculator,
  'find-day-calculator': FindDayCalculator,
  'global-settings': GlobalSettings,
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

export const ToolsPortal: React.FC<ToolsPortalProps> = ({ onHome, onInvoice, onBankStatement, onPayInPayOut, onSubscribe, onInvitation, onEventPage, onLogoCreator, onAtsAnalyser, onEbookCreator, pendingToolSelect, onPendingToolConsumed, defaultDomain: defaultDomainProp, onDefaultDomainConsumed }) => {
  const [activeTool, setActiveTool] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tool');
  });
  const [activeSection, setActiveSection] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('section') || 'home';
  });
  const [showExpiredToast, setShowExpiredToast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { canUpload } = useAuth();
  const isSubscribed = canUpload();
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

  // ── Sync active state with browser URL search parameters ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTool) {
      params.set('tool', activeTool);
      const sectionInfo = TOOL_TO_SECTION[activeTool];
      if (sectionInfo) {
        params.set('section', sectionInfo.sectionId);
      } else {
        params.delete('section');
      }
    } else {
      params.delete('tool');
      if (activeSection && activeSection !== 'home') {
        params.set('section', activeSection);
      } else {
        params.delete('section');
      }
    }
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
    if (window.location.search !== (newSearch ? '?' + newSearch : '')) {
      window.history.pushState({}, '', newUrl);
    }
  }, [activeTool, activeSection]);

  // ── Support browser Back/Forward navigation ──
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tool = params.get('tool');
      const section = params.get('section') || 'home';
      setActiveTool(tool);
      setActiveSection(section);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Dynamic SEO Title & Meta Description update ──
  useEffect(() => {
    if (activeTool) {
      const toolMeta = MENU_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTool);
      if (toolMeta) {
        document.title = `${toolMeta.label} — Zezha Tools`;
        let descMeta = document.querySelector('meta[name="description"]');
        if (!descMeta) {
          descMeta = document.createElement('meta');
          descMeta.setAttribute('name', 'description');
          document.head.appendChild(descMeta);
        }
        descMeta.setAttribute('content', `Use the free online ${toolMeta.label} on Zezha Tools. 100% browser-based, secure, and easy to use.`);
      }
    } else if (activeSection && activeSection !== 'home') {
      const sectionMeta = MENU_SECTIONS.find(s => s.id === activeSection);
      if (sectionMeta) {
        document.title = `${sectionMeta.label} Utilities — Zezha Tools`;
        let descMeta = document.querySelector('meta[name="description"]');
        if (!descMeta) {
          descMeta = document.createElement('meta');
          descMeta.setAttribute('name', 'description');
          document.head.appendChild(descMeta);
        }
        descMeta.setAttribute('content', `Explore free online ${sectionMeta.label} utilities on Zezha Tools. 100% secure, browser-based tools.`);
      }
    } else {
      document.title = "Zezha Tools — Web Utilities & Calculators Hub";
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', "Zezha Tools — 400+ free browser-based web utilities, calculators, PDF tools, and business solutions. No data uploaded to any server.");
      }
    }
  }, [activeTool, activeSection]);

  // Scroll content area to top when switching tools or sections
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTool, activeSection]);

  // ── Auto-select tool from global search ──
  React.useEffect(() => {
    if (pendingToolSelect) {
      setActiveSection(pendingToolSelect.sectionId);
      setActiveTool(pendingToolSelect.toolId);
      onPendingToolConsumed?.();
    }
  }, [pendingToolSelect, onPendingToolConsumed]);

  const handleSelectTool = (toolId: string) => {
    // Intercept certain tools that are actually standalone sections
    if (['startup-name-checker', 'festival-gift-planner', 'rent-vs-buy-calculator', 'marriage-budget-planner', 'unit-converter', 'products', 'home', 'invitation-creator', 'event-page-creator', 'logo-creator'].includes(toolId)) {
      handleSelectSection(toolId);
      return;
    }

    if (!isSubscribed) {
      setShowExpiredToast(true);
      setTimeout(() => { setShowExpiredToast(false); onSubscribe?.(); }, 1500);
      return;
    }
    // Track tool usage for activity stats
    const sectionInfo = TOOL_TO_SECTION[toolId];
    const toolMeta = MENU_SECTIONS.flatMap(s => s.items).find(i => i.id === toolId);
    activityTracker.trackUsage(toolId, toolMeta?.label || toolId, sectionInfo?.sectionId, sectionInfo?.sectionLabel);

    setActiveTool(toolId);
  };

  const handleSelectSection = (sectionId: string) => {
    if (['home', 'get-img-video', 'products', 'life-decision-simulator', 'startup-name-checker', 'festival-gift-planner', 'rent-vs-buy-calculator', 'marriage-budget-planner', 'unit-converter', 'govt-scheme-finder', 'invitation-creator', 'event-page-creator', 'logo-creator'].includes(sectionId)) {
      if (!isSubscribed) {
        setShowExpiredToast(true);
        setTimeout(() => { setShowExpiredToast(false); onSubscribe?.(); }, 1500);
        return;
      }
      setActiveSection(sectionId);
      setActiveTool(null);
      return;
    }
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
      case 'get-img-video':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Image Downloader...</div>}>
            <ImageSearchDownloader />
          </Suspense>
        );
      case 'products':
        return <ProductsPage />;
      case 'convertors':
        return <ImageToPdf />;
      case 'business-tax':
        return <ProfitLossCalculator />;
      case 'loans-emi':
        return <LoanCalculator />;
      case 'investments':
        return <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Investment Calculator...</div>}><FdCalculator /></Suspense>;
      case 'utilities':
        return <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Currency Calculator...</div>}><CurrencyCalculator /></Suspense>;
      case 'dev-toolkit':
        return <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading JSON Formatter...</div>}><JsonFormatter /></Suspense>;
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
        return (<div className="flex flex-col h-full"><div className="flex-1 overflow-y-auto"><Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Universal Unit Converter...</div>}><UnitConverterPage onBack={() => setActiveSection('utilities')} /></Suspense></div></div>);
      case 'raw-data':
        return <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Raw Data...</div>}><RawDataIndianStates /></Suspense>;

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
      default:
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading Image Downloader...</div>}>
            <ImageSearchDownloader />
          </Suspense>
        );
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
            isSubscribed={isSubscribed}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div ref={contentRef} className="flex-1 overflow-y-auto tool-container-wrap">
            {renderContent()}
          </div>

          {/* Subscription expired toast */}
          {showExpiredToast && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in">
              <div className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Subscription expired, please upgrade.
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolsLayout>
  );
};
