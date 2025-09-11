import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import axios from "axios";

export interface Expense {
  id: number;
  categoryId: number;
  description: string;
  amount: number;
  date: string;
}

export interface SummaryResponse {
  totalExpenses: number;
  remainingBalance: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
}

interface UseDashboardDataOptions {
  month?: string;
}

export const useDashboardData = (opts?: UseDashboardDataOptions) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        // requêtes parallèles
        const [resExpenses, resCategories, resSummary] = await Promise.all([
          api.get<Expense[]>("/expenses", {
            params: opts?.month ? { month: opts.month } : {},
            signal,
          }),
          api.get<Category[]>("/categories", { signal }),
          api.get<SummaryResponse>("/summary/monthly", {
            params: opts?.month ? { month: opts.month } : {},
            signal,
          }),
        ]);

        const expensesData = resExpenses.data ?? [];
        const categoriesData = resCategories.data ?? [];
        const summaryData = resSummary.data ?? {
          totalExpenses: 0,
          remainingBalance: 0,
        };

        const summaryStats: Stat[] = [
          {
            name: "Dépenses ce mois",
            value: `${(summaryData.totalExpenses ?? 0).toFixed(2)} Ar`,
            change: "+0%",
            changeType: "increase",
          },
          {
            name: "Budget restant",
            value: `${(summaryData.remainingBalance ?? 0).toFixed(2)} Ar`,
            change: "-0%",
            changeType:
              summaryData.remainingBalance >= 0 ? "increase" : "decrease",
          },
          {
            name: "Dépenses moyennes/jour",
            value: `${((summaryData.totalExpenses ?? 0) / 30).toFixed(2)} Ar`,
            change: "+0%",
            changeType: "increase",
          },
        ];

        setExpenses(expensesData);
        setStats(summaryStats);
        setCategories(categoriesData);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          // Requête annulée => pas d’erreur affichée
          return;
        }
        let message = "Erreur réseau";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || err.message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [opts?.month]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort(); // annule les requêtes si le composant se démonte
    };
  }, [fetchData]);

  return {
    expenses,
    stats,
    categories,
    loading,
    error,
    refetch: () => fetchData(), // refetch manuel sans AbortController
  };
};

export default useDashboardData;
