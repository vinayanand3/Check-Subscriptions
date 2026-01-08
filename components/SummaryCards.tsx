import React from 'react';
import { CreditCard, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { AnalysisResult } from '../types';
import { formatCurrency } from '../utils';

interface SummaryCardsProps {
  data: AnalysisResult;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Active Subscriptions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Active</span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">Active Subscriptions</h3>
        <p className="text-3xl font-bold text-slate-800">{data.totalActiveSubscriptions}</p>
      </div>

      {/* Monthly Cost */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">Monthly</span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">Total Monthly Cost</h3>
        <p className="text-3xl font-bold text-slate-800">{formatCurrency(data.totalMonthlySubscriptionCost)}</p>
      </div>

      {/* Yearly Projection */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">Projected</span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">Yearly Projection</h3>
        <p className="text-3xl font-bold text-slate-800">{formatCurrency(data.totalMonthlySubscriptionCost * 12)}</p>
      </div>

      {/* Top Category */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-amber-100 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
           <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2 py-1 rounded-full">Insight</span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">Highest Spend Category</h3>
        <p className="text-xl font-bold text-slate-800 truncate">
          {data.categoryStats.length > 0 
            ? data.categoryStats.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
            : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;