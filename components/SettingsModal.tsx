import React, { useState } from 'react';
import { X, Plus, Trash2, Settings, Bell, Filter } from 'lucide-react';
import { AnalysisSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AnalysisSettings;
  setSettings: React.Dispatch<React.SetStateAction<AnalysisSettings>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');

  if (!isOpen) return null;

  const addKeyword = (type: 'include' | 'exclude') => {
    if (type === 'include' && newInclude.trim()) {
      setSettings(prev => ({ ...prev, includeKeywords: [...prev.includeKeywords, newInclude.trim()] }));
      setNewInclude('');
    } else if (type === 'exclude' && newExclude.trim()) {
      setSettings(prev => ({ ...prev, excludeKeywords: [...prev.excludeKeywords, newExclude.trim()] }));
      setNewExclude('');
    }
  };

  const removeKeyword = (type: 'include' | 'exclude', index: number) => {
    setSettings(prev => ({
      ...prev,
      [type === 'include' ? 'includeKeywords' : 'excludeKeywords']: 
        prev[type === 'include' ? 'includeKeywords' : 'excludeKeywords'].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2.5 rounded-xl">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-800">Preferences</h2>
               <p className="text-xs text-slate-500">Customize your analysis rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
          {/* API Key Configuration */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">AI Configuration</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-slate-700">
                  Gemini API Key
                </label>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  Get a key from AI Studio
                </a>
              </div>
              <input
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Paste your Gemini API key here"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-400 mt-3">
                Your key is stored locally in your browser and used only to process your requests.
              </p>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Payment Alerts</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Alert Threshold
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <input
                    type="range"
                    min="1"
                    max="14"
                    value={settings.alertThresholdDays}
                    onChange={(e) => setSettings(prev => ({ ...prev, alertThresholdDays: parseInt(e.target.value) }))}
                    className="w-full h-full opacity-0 cursor-pointer absolute"
                    style={{ zIndex: 10 }}
                    />
                    <div className="h-full bg-indigo-500 rounded-full relative" style={{ width: `${(settings.alertThresholdDays / 14) * 100}%` }}></div>
                </div>
                <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 shadow-sm min-w-[4rem] text-center">
                  {settings.alertThresholdDays} days
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                We'll highlight upcoming payments due within this number of days in the 'Upcoming Alerts' card.
              </p>
            </div>
          </section>

          {/* Custom Rules */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                 <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Keywords & Rules</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Include Rules */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Force Include <span className="text-slate-400 font-normal ml-1">(Always Sub)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    placeholder="e.g. Gym, Adobe"
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword('include')}
                  />
                  <button 
                    onClick={() => addKeyword('include')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {settings.includeKeywords.map((keyword, i) => (
                    <div key={i} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-sm text-slate-700 font-medium">{keyword}</span>
                      <button onClick={() => removeKeyword('include', i)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {settings.includeKeywords.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-400">No inclusion rules set.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Exclude Rules */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Force Exclude <span className="text-slate-400 font-normal ml-1">(Ignore)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newExclude}
                    onChange={(e) => setNewExclude(e.target.value)}
                    placeholder="e.g. Rent, Transfer"
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword('exclude')}
                  />
                  <button 
                    onClick={() => addKeyword('exclude')}
                    className="bg-slate-700 hover:bg-slate-800 text-white p-2.5 rounded-xl transition-colors shadow-sm shadow-slate-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {settings.excludeKeywords.map((keyword, i) => (
                    <div key={i} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-sm text-slate-700 font-medium">{keyword}</span>
                      <button onClick={() => removeKeyword('exclude', i)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {settings.excludeKeywords.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-400">No exclusion rules set.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;