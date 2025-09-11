import type { AlertResponse, MonthlySummary } from "../types/summary.types";
import api from "../utils/api";

export const DashboardService = {
  async getMonthlySummary(month?: string): Promise<MonthlySummary> {
    const res = await api.get("/summary/monthly", {
      params: month ? { month } : {},
    });
    return res.data;
  },

  async getSummaryBetweenDates(start: string, end: string): Promise<MonthlySummary> {
    const res = await api.get(`/summary`, {
      params: { start, end },
    });
    return res.data;
  },

  async getAlerts(): Promise<AlertResponse> {
    const res = await api.get(`/summary/alerts`);
    return res.data;
  },
};
