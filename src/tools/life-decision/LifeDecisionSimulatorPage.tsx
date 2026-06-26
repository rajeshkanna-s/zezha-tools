import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, ShieldCheck, Brain, X, Globe } from 'lucide-react';
import { UserMenu } from '../../auth/UserMenu';
import type {
    BaselineData, BaselineSnapshot as SnapshotType, ScenarioResult, ComparisonResult,
} from './lifeDecisionEngine';
import {
    getDefaultBaseline, computeBaselineSnapshot, saveBaseline, loadBaseline, compareScenarios
} from './lifeDecisionEngine';
import { BaselineForm } from './BaselineForm';
import { BaselineSnapshotView } from './BaselineSnapshot';
import { ScenarioPicker } from './ScenarioPicker';
import { ScenarioInputPage } from './ScenarioInputPage';
import { RippleEffectReport } from './RippleEffectReport';
import { ScenarioComparison } from './ScenarioComparison';

interface Props { onBack?: () => void; onHome?: () => void; embedded?: boolean; }

type Step = 'baseline' | 'snapshot' | 'scenarios' | 'scenario-input' | 'results' | 'comparison';

export const LifeDecisionSimulatorPage: React.FC<Props> = ({ onBack, onHome, embedded = false }) => {
    const [step, setStep] = useState<Step>('baseline');
    const [baseline, setBaseline] = useState<BaselineData>(getDefaultBaseline());
    const [snapshot, setSnapshot] = useState<SnapshotType | null>(null);
    const [selectedScenario, setSelectedScenario] = useState<string>('');
    const [currentResult, setCurrentResult] = useState<ScenarioResult | null>(null);
    const [savedResults, setSavedResults] = useState<{ name: string; result: ScenarioResult }[]>([]);
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);
    const [policyModal, setPolicyModal] = useState<string | null>(null);

    // Load saved baseline on mount (pre-fill form, but always start from baseline)
    useEffect(() => {
        const saved = loadBaseline();
        if (saved) {
            setBaseline(saved);
        }
    }, []);

    const handleBaselineComplete = (data: BaselineData) => {
        setBaseline(data);
        saveBaseline(data);
        const snap = computeBaselineSnapshot(data);
        setSnapshot(snap);
        setStep('snapshot');
    };

    const handleScenarioSelect = (id: string) => {
        setSelectedScenario(id);
        setStep('scenario-input');
    };

    const handleScenarioResult = (result: ScenarioResult) => {
        setCurrentResult(result);
        setStep('results');
    };

    const handleSaveResult = () => {
        if (currentResult) {
            setSavedResults(prev => [...prev, { name: currentResult.scenarioName, result: currentResult }]);
        }
    };

    const handleCompare = () => {
        if (savedResults.length >= 2) {
            setComparison(compareScenarios(savedResults));
            setStep('comparison');
        } else if (currentResult) {
            // Save current and show message
            handleSaveResult();
            alert('Save at least 2 scenarios to compare. Run another scenario and save it too!');
        }
    };

    return (
        <div className={`flex flex-col ${embedded ? 'h-full' : 'h-screen'} overflow-hidden bg-slate-50 font-sans`}>
            {/* Header - hidden when embedded in sidebar layout */}
            {!embedded && (
                <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 px-6 py-3 flex justify-between items-center z-30 relative">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="ReportsIQ" className="h-9 w-auto" />
                        <h1 className="text-lg m-0 font-bold tracking-tight text-slate-900 font-display">
                            Reports<span className="text-primary">IQ</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
                        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors">
                            <ArrowLeft size={14} /><span className="hidden sm:inline">Back to Tools</span><span className="sm:hidden">Back</span>
                        </button>
                        <button onClick={onHome} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors">
                            <Home size={14} /> Home
                        </button>
                        <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs font-semibold">
                            <Brain size={14} /> Life Decision Simulator
                        </span>
                        <span className="hidden lg:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 text-xs font-semibold">
                            <ShieldCheck size={14} className="mr-1.5 text-emerald-500" /> Local Processing
                        </span>
                        <UserMenu onAccount={onHome} />
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-8">
                    {step === 'baseline' && (
                        <div>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Brain size={32} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Life Decision Simulator</h2>
                                <p className="text-sm text-slate-500 max-w-md mx-auto">Build your financial baseline once — then test any major life decision and instantly see the ripple effect across your entire financial life.</p>
                            </div>
                            <BaselineForm initial={baseline} onComplete={handleBaselineComplete} />
                        </div>
                    )}

                    {step === 'snapshot' && snapshot && (
                        <BaselineSnapshotView
                            snapshot={snapshot}
                            onContinue={() => setStep('scenarios')}
                            onEditBaseline={() => setStep('baseline')}
                        />
                    )}

                    {step === 'scenarios' && (
                        <div>
                            <ScenarioPicker onSelect={handleScenarioSelect} />
                            {savedResults.length >= 2 && (
                                <div className="text-center mt-6">
                                    <button onClick={() => { setComparison(compareScenarios(savedResults)); setStep('comparison'); }}
                                        className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all">
                                        📊 Compare {savedResults.length} Saved Scenarios
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'scenario-input' && (
                        <ScenarioInputPage
                            scenarioId={selectedScenario}
                            baseline={baseline}
                            onResult={handleScenarioResult}
                            onBack={() => setStep('scenarios')}
                        />
                    )}

                    {step === 'results' && currentResult && (
                        <RippleEffectReport
                            result={currentResult}
                            onBack={() => setStep('scenarios')}
                            onSave={handleSaveResult}
                            onCompare={handleCompare}
                        />
                    )}

                    {step === 'comparison' && comparison && (
                        <ScenarioComparison
                            comparison={comparison}
                            onBack={() => setStep('scenarios')}
                        />
                    )}
                </div>
            </main>

            {/* Footer - hidden when embedded */}
            {!embedded && (
                <footer className="bg-slate-900 text-slate-400 py-4 px-6">
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[11px]">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="ReportsIQ" className="h-5 w-auto opacity-70" />
                            <span className="font-semibold text-slate-300 text-sm">Reports<span className="text-primary-light">IQ</span></span>
                            <span className="text-slate-500 ml-2">© 2026 ZEZHA TECHNOLOGY PRIVATE LIMITED</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
                            <a href="http://zezha.in/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors flex items-center gap-1"><Globe size={14} /> About Zezha</a>
                            <button onClick={() => setPolicyModal('privacy')} className="hover:text-slate-200 transition-colors">Privacy Notice</button>
                            <button onClick={() => setPolicyModal('terms')} className="hover:text-slate-200 transition-colors">Site Terms</button>
                            <button onClick={() => setPolicyModal('nodata')} className="hover:text-slate-200 transition-colors">No Data Saved</button>
                        </div>
                    </div>
                </footer>
            )}

            {/* Policy Modal */}
            {policyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setPolicyModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPolicyModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
                        {policyModal === 'privacy' && (
                            <div><h2 className="text-lg font-bold text-slate-900 mb-4">Privacy Notice</h2><p className="text-sm text-slate-600">All calculations happen entirely within your browser. Your financial data is stored only in your browser's localStorage. No data is uploaded, transmitted, or stored externally. When you clear your browser data, all information is gone.</p></div>
                        )}
                        {policyModal === 'terms' && (
                            <div><h2 className="text-lg font-bold text-slate-900 mb-4">Site Terms</h2><p className="text-sm text-slate-600">The Life Decision Simulator provides estimates for educational purposes only. Results are based on simplified models and assumptions. This is not financial advice. Please consult a qualified financial advisor before making major financial decisions.</p></div>
                        )}
                        {policyModal === 'nodata' && (
                            <div><h2 className="text-lg font-bold text-slate-900 mb-4">No Data Saved</h2><p className="text-sm text-slate-600">Your financial baseline is stored only in your browser's localStorage. No data is sent to any server. We never see your financial data. You can clear it anytime from your browser settings.</p></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
