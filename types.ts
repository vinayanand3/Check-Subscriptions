export interface Subscription {
  name: string;
  amount: number;
  currency: string;
  frequency: 'Monthly' | 'Yearly' | 'Weekly' | 'Unknown';
  category: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  description?: string;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyStat {
  month: string;
  totalSpend: number;
  subscriptionSpend: number;
}

export interface AnalysisResult {
  subscriptions: Subscription[];
  monthlyStats: MonthlyStat[];
  categoryStats: CategoryStat[];
  totalActiveSubscriptions: number;
  totalMonthlySubscriptionCost: number;
  financialSummary: string;
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface AnalysisSettings {
  apiKey?: string;
  includeKeywords: string[];
  excludeKeywords: string[];
  alertThresholdDays: number;
}