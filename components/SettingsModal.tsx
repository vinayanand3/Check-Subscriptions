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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded-lg">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Analysis Preferences</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Notifications */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Payment Alerts</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notify me when a payment is due within:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={settings.alertThresholdDays}
                  onChange={(e) => setSettings(prev => ({ ...prev, alertThresholdDays: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 min-w-[3rem] text-center">
                  {settings.alertThresholdDays} d
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Upcoming payments due within this timeframe will be highlighted in your dashboard.
              </p>
            </div>
          </section>

          {/* Custom Rules */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-800">Custom Keyword Rules</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Include Rules */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Always Include (Force Subscription)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    placeholder="e.g. Gym, Adobe"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword('include')}
                  />
                  <button 
                    onClick={() => addKeyword('include')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {settings.includeKeywords.map((keyword, i) => (
                    <div key={i} className="flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                      <span className="text-sm text-indigo-700 font-medium">{keyword}</span>
                      <button onClick={() => removeKeyword('include', i)} className="text-indigo-400 hover:text-indigo-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {settings.includeKeywords.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No custom inclusion rules.</p>
                  )}
                </div>
              </div>

              {/* Exclude Rules */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Always Exclude (Ignore Transaction)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newExclude}
                    onChange={(e) => setNewExclude(e.target.value)}
                    placeholder="e.g. Rent, Transfer"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword('exclude')}
                  />
                  <button 
                    onClick={() => addKeyword('exclude')}
                    className="bg-slate-700 hover:bg-slate-800 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {settings.excludeKeywords.map((keyword, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700 font-medium">{keyword}</span>
                      <button onClick={() => removeKeyword('exclude', i)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {settings.excludeKeywords.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No custom exclusion rules.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;