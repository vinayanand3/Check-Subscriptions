import React, { useState } from 'react';
import { Sparkles, ArrowRight, Activity, ShieldCheck, PieChart, Info, Settings, Bell } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        setSettings={setSettings}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetAnalysis}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SubScout
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
               title="Settings & Preferences"
             >
               <Settings className="w-5 h-5" />
               {(settings.includeKeywords.length > 0 || settings.excludeKeywords.length > 0) && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
               )}
             </button>
             <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure & Private</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!result ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Audit Your <span className="text-indigo-600">Subscriptions</span> in Seconds
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">
                Upload your bank statements (PDF, CSV, Images) to detect recurring payments, analyze monthly spending, and find hidden subscriptions using the power of Gemini Flash 3.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Upload Statements</h3>
                  <p className="text-xs text-slate-400 mt-1">Accepts PDF, CSV, Images</p>
                </div>
                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">Min. 3 files</span>
              </div>
              
              <FileUpload files={files} setFiles={setFiles} />

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" /> Configure Rules & Alerts
                </button>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                  <div className="bg-red-100 p-1 rounded-full text-red-600 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">Analysis Failed</h4>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={files.length < 3 || isAnalyzing}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    files.length >= 3 && !isAnalyzing
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing with Gemini...
                    </>
                  ) : (
                    <>
                      Start Analysis <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  Powered by Gemini 3 Flash Preview. Your data is processed for analysis only.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                { icon: Activity, title: 'Smart Detection', desc: 'Identifies recurring patterns from PDFs & CSVs.' },
                { icon: PieChart, title: 'Visual Insights', desc: 'Beautiful charts to visualize your monthly burn rate.' },
                { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about upcoming subscription renewals.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 text-indigo-600">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
                    <p className="text-slate-500">Based on analysis of {files.length} statements</p>
                  </div>
                  <button 
                    onClick={resetAnalysis}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Start New Analysis
                  </button>
                </div>
             </div>

             <div className="bg-indigo-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <h3 className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-2">AI Insights</h3>
                <p className="text-lg md:text-xl font-medium leading-relaxed max-w-4xl relative z-10">
                  "{result.financialSummary}"
                </p>
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