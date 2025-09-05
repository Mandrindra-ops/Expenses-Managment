import { Request, Response } from 'express';
import Expense from '../models/expense.model';

interface CreateExpenseBody {
  amount: number;
  date?: string;
  categoryId: number;
  type?: 'OneTime' | 'Recurring';
  description?: string;
  startDate?: string;
  endDate?: string;
}

export const createExpense = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      date,
      categoryId,
      type = 'OneTime',
      description,
      startDate,
      endDate,
    } = req.body as unknown as CreateExpenseBody; // ⚡ type assertion

    const receipt = req.file?.path;

    const expense = await Expense.create({
      amount,
      date,
      description,
      type,
      startDate,
      endDate,
      categoryId,
      userId: req.user!.id,
      receipt,
    });

    res.status(201).json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
