import React from 'react';
import { Subscription } from '../types';
import { formatCurrency } from '../utils';
import { AlertTriangle, CalendarDays, Tag } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Active Subscriptions</h3>
        <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-100">
          {subscriptions.length} Services
        </span>
      </div>
      
      {subscriptions.length === 0 ? (
         <div className="p-16 text-center">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Tag className="w-8 h-8 text-slate-300" />
           </div>
           <p className="text-slate-500 font-medium">No active subscriptions detected.</p>
         </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-6">Service</th>
                <th className="p-6">Category</th>
                <th className="p-6">Frequency</th>
                <th className="p-6 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((sub, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shadow-sm group-hover:from-indigo-100 group-hover:to-indigo-200 group-hover:text-indigo-600 transition-all">
                        {sub.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base">{sub.name}</p>
                        {sub.description && (
                          <p className="text-sm text-slate-400 truncate max-w-[240px] mt-0.5">{sub.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {sub.category}
                    </span>
                  </td>
                  <td className="p-6">
                    {sub.frequency === 'Unknown' ? (
                      <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit text-sm font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Verify
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {sub.frequency}
                      </div>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="font-bold text-slate-900 text-lg">
                      {formatCurrency(sub.amount, sub.currency)}
                    </div>
                    {sub.frequency !== 'Monthly' && sub.frequency !== 'Unknown' && (
                      <div className="text-xs font-semibold text-slate-400 mt-1">
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