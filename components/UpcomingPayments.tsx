import React from 'react';
import { Subscription } from '../types';
import { Calendar, BellRing, Clock, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
  alertThresholdDays: number;
}

const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ subscriptions, alertThresholdDays }) => {
  const getDaysUntil = (dateStr?: string) => {
    if (!dateStr) return Infinity;
    const target = new Date(dateStr);
    const today = new Date();
    target.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const upcomingSubs = subscriptions
    .map(sub => ({ ...sub, daysUntil: getDaysUntil(sub.nextPaymentDate) }))
    .filter(sub => sub.daysUntil >= 0 && sub.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const alertSubs = upcomingSubs.filter(sub => sub.daysUntil <= alertThresholdDays);
  const otherUpcoming = upcomingSubs.filter(sub => sub.daysUntil > alertThresholdDays);

  if (upcomingSubs.length === 0) return null;

  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* High Alert Card */}
      <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner border border-white/20">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Alerts</h3>
            <p className="text-indigo-100 text-sm font-medium opacity-80">Due in {alertThresholdDays} days</p>
          </div>
        </div>

        <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {alertSubs.length > 0 ? (
            alertSubs.map((sub, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-colors">
                <div>
                  <p className="font-bold text-base">{sub.name}</p>
                  <p className="text-xs text-indigo-100 font-medium mt-0.5">
                    {sub.daysUntil === 0 ? 'Due Today' : `Due in ${sub.daysUntil} days`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(sub.amount, sub.currency)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-10 h-10 text-indigo-300 mb-3 opacity-50" />
              <p className="text-indigo-100 font-medium">You're all clear!</p>
              <p className="text-indigo-200/60 text-sm">No immediate payments due.</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Timeline */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-50 p-2 rounded-lg">
             <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">30-Day Forecast</h3>
        </div>
        
        <div className="space-y-4">
          {otherUpcoming.length > 0 || alertSubs.length > 0 ? (
            [...alertSubs, ...otherUpcoming].slice(0, 5).map((sub, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-16 text-center flex-shrink-0 bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {sub.nextPaymentDate ? new Date(sub.nextPaymentDate).toLocaleString('default', { month: 'short' }) : ''}
                  </div>
                  <div className="text-xl font-extrabold text-slate-700">
                    {sub.nextPaymentDate ? new Date(sub.nextPaymentDate).getDate() : '?'}
                  </div>
                </div>
                
                <div className="flex-1 bg-white border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all p-4 rounded-xl flex items-center justify-between shadow-sm group-hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-10 rounded-full ${sub.daysUntil <= alertThresholdDays ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-200'}`}></div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">{sub.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{sub.daysUntil === 0 ? 'Due Today' : `${sub.daysUntil} days left`}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 text-lg">{formatCurrency(sub.amount, sub.currency)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-10 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">No upcoming payments detected for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingPayments;