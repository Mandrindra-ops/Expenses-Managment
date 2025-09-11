// src/hooks/useDashboardData.ts
import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import axios from "axios";

export interface Expense {
    id: number;
    category: string;
    description: string;
    amount: number;
    date: string;
}

interface SummaryResponse {
    totalExpenses: number;
    remainingBalance: number;
}

export interface Stat {
    name: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease";
}

export const useDashboardData = (opts?: { month?: string }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        let isMounted = true;

        try {
            // Parallel requests
            const [resExpenses, resSummary] = await Promise.all([
                api.get<Expense[]>("/expenses", { params: opts?.month ? { month: opts.month } : {} }),
                api.get<SummaryResponse>("/summary/monthly", { params: opts?.month ? { month: opts.month } : {} }),
            ]);

            const expensesData = resExpenses.data ?? [];
            const summaryData = resSummary.data ?? { totalExpenses: 0, remainingBalance: 0 };

            const summaryStats: Stat[] = [
                {
                    name: "Dépenses ce mois",
                    value: `${summaryData.totalExpenses?.toFixed(2) ?? 0} Ar`,
                    change: "+0%", 
                    changeType: "increase",
                },
                {
                    name: "Budget restant",
                    value: `${summaryData.remainingBalance?.toFixed(2) ?? 0} Ar `,
                    change: "-0%",
                    changeType: summaryData.remainingBalance >= 0 ? "increase" : "decrease",
                },
                {
                    name: "Dépenses moyennes/jour",
                    value: `${(summaryData.totalExpenses / 30)} Ar`,
                    change: "+0%",
                    changeType: "increase",
                },
            ];

            if (isMounted) {
                setExpenses(expensesData);
                setStats(summaryStats);
            }
        } catch (err: unknown) {
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

        return () => {
            isMounted = false;
        };
    }, [opts?.month]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await fetchData();
        })();
        return () => {
            mounted = false;
        };
    }, [fetchData]);

    return {
        expenses,
        stats,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useDashboardData;
