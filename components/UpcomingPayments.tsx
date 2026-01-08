import React from 'react';
import { Subscription } from '../types';
import { Calendar, BellRing, Clock } from 'lucide-react';
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
    // Reset hours for accurate day calc
    target.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const upcomingSubs = subscriptions
    .map(sub => ({ ...sub, daysUntil: getDaysUntil(sub.nextPaymentDate) }))
    .filter(sub => sub.daysUntil >= 0 && sub.daysUntil <= 30) // Show next 30 days
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const alertSubs = upcomingSubs.filter(sub => sub.daysUntil <= alertThresholdDays);
  const otherUpcoming = upcomingSubs.filter(sub => sub.daysUntil > alertThresholdDays);

  if (upcomingSubs.length === 0) return null;

  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* High Alert Card */}
      <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Upcoming Alerts</h3>
            <p className="text-indigo-100 text-xs">Due within {alertThresholdDays} days</p>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          {alertSubs.length > 0 ? (
            alertSubs.map((sub, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{sub.name}</p>
                  <p className="text-xs text-indigo-200">
                    {sub.daysUntil === 0 ? 'Due Today' : `Due in ${sub.daysUntil} days`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(sub.amount, sub.currency)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-indigo-200 text-sm">No immediate payments due.</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Timeline */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-800">30-Day Forecast</h3>
        </div>
        
        <div className="space-y-4">
          {otherUpcoming.length > 0 || alertSubs.length > 0 ? (
            [...alertSubs, ...otherUpcoming].slice(0, 5).map((sub, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-16 text-center flex-shrink-0">
                  <div className="text-xs font-bold text-slate-400 uppercase">
                    {sub.nextPaymentDate ? new Date(sub.nextPaymentDate).toLocaleString('default', { month: 'short' }) : ''}
                  </div>
                  <div className="text-xl font-bold text-slate-800">
                    {sub.nextPaymentDate ? new Date(sub.nextPaymentDate).getDate() : '?'}
                  </div>
                </div>
                
                <div className="flex-1 bg-slate-50 group-hover:bg-slate-100 transition-colors p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${sub.daysUntil <= alertThresholdDays ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <p className="font-bold text-slate-700">{sub.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{sub.daysUntil === 0 ? 'Today' : `${sub.daysUntil} days left`}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800">{formatCurrency(sub.amount, sub.currency)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No upcoming payments detected for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingPayments;