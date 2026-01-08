import React, { useState } from 'react';
import { Sparkles, ArrowRight, Activity, ShieldCheck, PieChart, Info, Settings, Bell, Zap } from 'lucide-react';
import FileUpload from './components/FileUpload';
import SummaryCards from './components/SummaryCards';
import FinancialCharts from './components/FinancialCharts';
import SubscriptionList from './components/SubscriptionList';
import SettingsModal from './components/SettingsModal';
import UpcomingPayments from './components/UpcomingPayments';
import { analyzeBankStatements } from './services/geminiService';
import { AnalysisResult, FileWithPreview, AnalysisSettings } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Default Settings
  const [settings, setSettings] = useState<AnalysisSettings>({
    includeKeywords: [],
    excludeKeywords: [],
    alertThresholdDays: 3
  });

  const handleAnalyze = async () => {
    if (files.length < 3) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await analyzeBankStatements(files, settings);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setFiles([]);
    setError(null);
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        setSettings={setSettings}
      />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetAnalysis}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              SubScout
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all duration-200 relative hover:text-indigo-600"
               title="Settings & Preferences"
             >
               <Settings className="w-5 h-5" />
               {(settings.includeKeywords.length > 0 || settings.excludeKeywords.length > 0) && (
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white"></span>
               )}
             </button>
             <div className="hidden md:flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Analysis</span>
             </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 pt-32 pb-16">
        {!result ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
                <Zap className="w-4 h-4 fill-indigo-600" />
                <span>Powered by Gemini 3.0 Flash</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Master Your <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Subscriptions</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Stop paying for unused services. Upload your bank statements to detect recurring payments, visualize spending, and predict future bills instantly.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 ring-1 ring-slate-100">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Upload Statements</h3>
                  <p className="text-sm text-slate-500 mt-1">Supported formats: PDF, CSV, Images</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  <Info className="w-4 h-4 text-indigo-500" />
                  <span>Min. 3 files for accuracy</span>
                </div>
              </div>
              
              <FileUpload files={files} setFiles={setFiles} />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-sm text-slate-600 font-medium hover:text-indigo-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                >
                  <Settings className="w-4 h-4" /> Customize Rules
                </button>
              </div>

              {error && (
                <div className="mt-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-lg text-red-600 flex-shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Analysis Failed</h4>
                    <p className="text-sm text-red-700 mt-1 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <button
                  onClick={handleAnalyze}
                  disabled={files.length < 3 || isAnalyzing}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    files.length >= 3 && !isAnalyzing
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing financial data...
                    </>
                  ) : (
                    <>
                      Start Analysis <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-5 font-medium">
                  Your data is processed securely in-memory and is never stored.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              {[
                { icon: Activity, title: 'Smart Detection', desc: 'AI identifies recurring patterns from messy bank descriptions.' },
                { icon: PieChart, title: 'Visual Insights', desc: 'Interactive charts to visualize your monthly burn rate category.' },
                { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about upcoming renewals before they happen.' },
              ].map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/80 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 w-fit mb-4 text-indigo-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-slate-500 font-medium">Analysis based on {files.length} statements</p>
                  </div>
                </div>
                <button 
                  onClick={resetAnalysis}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
                >
                  Start New Analysis
                </button>
             </div>

             {/* AI Summary Banner */}
             <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                <div className="absolute top-0 right-0 p-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                    <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-widest">AI Financial Insights</h3>
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-5xl text-indigo-50">
                    "{result.financialSummary}"
                  </p>
                </div>
             </div>
             
             <UpcomingPayments 
               subscriptions={result.subscriptions} 
               alertThresholdDays={settings.alertThresholdDays} 
             />

             <SummaryCards data={result} />
             <FinancialCharts data={result} />
             <SubscriptionList subscriptions={result.subscriptions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;