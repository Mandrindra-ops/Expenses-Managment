import { Op } from "sequelize";
import Income from "../models/income.model";
import Expense from "../models/expense.model";
import sequelize from "../utils/database";
import Category from "../models/category.model";

export class SummaryService {
  static async getSummary(userId: string, start: Date, end: Date) {
    const [totalExpenses, totalIncome, expensesByCategory, incomeBySource] =
      await Promise.all([
        Expense.sum("amount", {
          where: {
            userId,
            date: {
              [Op.between]: [start, end],
            },
          },
        }),
        Income.sum("amount", {
          where: {
            userId,
            date: {
              [Op.between]: [start, end],
            },
          },
        }),
        Expense.findAll({
          attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "total"]],
          where: {
            userId,
            date: {
              [Op.between]: [start, end],
            },
          },
          include: [
            {
              model: Category,
              attributes: ["name"],
            },
          ],
          group: ["categoryId", "Category.id", "Category.name"],
          raw: false,
        }),
        Income.findAll({
          attributes: [
            "source",
            [sequelize.fn("SUM", sequelize.col("amount")), "total"],
          ],
          where: {
            userId,
            date: {
              [Op.between]: [start, end],
            },
          },
          group: ["source"],
          raw: true,
        }),
      ]);

    const balance = (totalIncome || 0) - (totalExpenses || 0);

    return {
      period: { start, end },
      totalExpenses: totalExpenses || 0,
      totalIncomes: totalIncome || 0,
      balance,
      expensesByCategory: expensesByCategory.map((expense) => ({
        category: expense.categoryId,
        total: expense.dataValues,
      })),
      incomeBySource: incomeBySource.filter((income) => income.source),
    };
  }

  static async getMonthlySummary(userId: string, month?: string) {
    let startDate, endDate;

    if (month && typeof month == "string") {
      const [year, monthnum] = month.split("-").map(Number);
      startDate = new Date(year, monthnum - 1, 1);
      endDate = new Date(year, monthnum + 1, 0);
      console.log({ startDate, endDate });
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      console.log({ startDate, endDate });
    }

    return this.getSummary(userId, startDate, endDate);
  }

  static async getAlerts(userId: string) {
    const summary = await this.getMonthlySummary(userId);
    if (summary.totalExpenses > summary.totalIncomes) {
      return {
        alert: true,
        message: `You've exceeded your monthly budget by $${
          summary.totalExpenses - summary.totalIncomes
        }`,
        totalExpenses : `${summary.totalExpenses}`,
        totalIncomes : `${summary.totalIncomes}`,
      };
    }
    return { alert: false };
  }
}
