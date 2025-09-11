export type MonthlySummary = {
  income: number;
  expenses: number;
  balance: number;
  categories: { name: string; amount: number }[];
  monthlySpending: { month: string; total: number }[];
}

export type AlertResponse = {
  alert: boolean;
  message?: string;
}
