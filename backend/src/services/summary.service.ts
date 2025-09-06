import { Op } from "sequelize";
import Income from "../models/income.model";
import Expense from "../models/expense.model";

export class SummaryService {
  static async getSummary(userId: string, start: Date, end: Date) {
    const incomes = await Income.findAll({
      where: { userId, date: { [Op.between]: [start, end] } },
    });
    const where = {
        userId,
        [Op.or]: [
          { type: "one-time", date: { [Op.between]: [start, end] } },
          {
            type: "recurring",
            startDate: { [Op.lte]: end },
            [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: start } }],
          },
        ],
      }
    const expenses = await Expense.findAll({where});

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  }

  static async getMonthlySummary(userId: string, month: string) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    return this.getSummary(userId, start, end);
  }

  static async getAlerts(userId: string, month: string) {
    const summary = await this.getMonthlySummary(userId, month);
    if (summary.totalExpenses > summary.totalIncome) {
      return {
        alert: true,
        message: `You've exceeded your monthly budget by $${summary.totalExpenses - summary.totalIncome}`,
      };
    }
    return { alert: false };
  }
}
