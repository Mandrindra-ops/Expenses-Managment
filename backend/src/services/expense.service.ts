import Expense from "../models/expense.model";
import fs from "fs/promises";

export interface ReceiptFile {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  size: number;
  mtime: Date;
}

export const createExpense = async (data: {
  amount: number;
  date?: string;
  description?: string;
  type?: "OneTime" | "Recurring";
  receipt?: string;
  startDate?: string;
  endDate?: string;
  userId: number;
  categoryId: number;
}) => {
  return await Expense.create({
    ...data,
    type: data.type ?? "OneTime",
  });
};

export const getExpenses = async (
  startDate: String | undefined,
  endDate: String | undefined,
  categoryId: number | undefined,
  type: String | undefined,
  userId: number | undefined
) => {
  const whereClause: any = { userId };

  if (startDate && endDate) {
    whereClause.date = { $between: [startDate, endDate] };
  }

  if (categoryId) whereClause.categoryId = categoryId;
  if (type) whereClause.type = type;

  const expenses = await Expense.findAll({ where: whereClause });
  console.error(expenses);
  return expenses;
};

export const getExpenseById = async (id: number, userId: number) => {
  return await Expense.findOne({ where: { id, userId } });
};

export const updateExpense = async (
  id: number,
  userId: number,
  updates: Partial<{
    amount: number;
    date?: string;
    description?: string;
    type?: "OneTime" | "Recurring";
    receipt?: string;
    startDate?: string;
    endDate?: string;
    categoryId: number;
  }>
) => {
  const expense = await Expense.findOne({ where: { id, userId } });
  if (!expense) {
    throw new Error("Expense not found or not authorized");
  }

  if (updates.receipt && expense.receipt) {
    await fs.unlink(expense.receipt);
  }
  return await expense.update(updates);
};

// 🗑️ Delete expense (only if belongs to user)
export const deleteExpense = async (id: number, userId: number) => {
  const expense = await Expense.findOne({ where: { id, userId } });
  if (!expense) {
    throw new Error("Expense not found or not authorized");
  }
  if (expense.receipt) {
    try {
      await fs.unlink(expense.receipt);
    } catch (unlinkerror) {
      console.error("error deleting receipt file:", unlinkerror);
    }
  }
  await expense.destroy();
};
