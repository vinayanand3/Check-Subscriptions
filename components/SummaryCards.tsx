import React from 'react';
import { CreditCard, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { AnalysisResult } from '../types';
import { formatCurrency } from '../utils';

interface SummaryCardsProps {
  data: AnalysisResult;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Active Subscriptions',
      value: data.totalActiveSubscriptions,
      icon: CreditCard,
      color: 'blue',
      subtext: 'Services'
    },
    {
      title: 'Total Monthly Cost',
      value: formatCurrency(data.totalMonthlySubscriptionCost),
      icon: DollarSign,
      color: 'indigo',
      subtext: 'Per Month'
    },
    {
      title: 'Yearly Projection',
      value: formatCurrency(data.totalMonthlySubscriptionCost * 12),
      icon: Calendar,
      color: 'emerald',
      subtext: 'Estimated'
    },
    {
      title: 'Highest Spend Category',
      value: data.categoryStats.length > 0 
        ? data.categoryStats.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
        : 'N/A',
      icon: TrendingUp,
      color: 'amber',
      subtext: 'Top Category'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
              <card.icon className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider text-${card.color}-600 bg-${card.color}-50 px-2.5 py-1 rounded-lg`}>
              {card.subtext}
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight truncate" title={String(card.value)}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;