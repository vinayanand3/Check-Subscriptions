import React from 'react';
import { Subscription } from '../types';
import { formatCurrency } from '../utils';
import { Zap, AlertTriangle } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Active Subscriptions</h3>
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
          {subscriptions.length} Services
        </span>
      </div>
      
      {subscriptions.length === 0 ? (
         <div className="p-8 text-center text-slate-500">
           No active subscriptions detected.
         </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Frequency</th>
                <th className="p-4 font-semibold text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((sub, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                        {sub.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{sub.name}</p>
                        {sub.description && (
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{sub.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {sub.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {sub.frequency === 'Unknown' ? (
                      <span className="flex items-center gap-1 text-amber-500">
                        <AlertTriangle className="w-3 h-3" /> Verify
                      </span>
                    ) : (
                      sub.frequency
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-slate-800">
                      {formatCurrency(sub.amount, sub.currency)}
                    </div>
                    {sub.frequency !== 'Monthly' && sub.frequency !== 'Unknown' && (
                      <div className="text-xs text-slate-400">
                        per {sub.frequency.toLowerCase().replace('ly', '')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;