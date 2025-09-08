import { Request, Response } from "express";
import * as expenseService from '../services/expense.service';

interface CreateExpenseBody {
  amount: number;
  date?: string;
  categoryId: number;
  type?: "OneTime" | "Recurring";
  description?: string;
  startDate?: string;
  endDate?: string;
  receipt?: string;
}

export const createExpense = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      date,
      categoryId,
      type = "OneTime",
      description,
      startDate,
      endDate,
    } = req.body as unknown as CreateExpenseBody;

    const receipt = req.file?.path;
    const userId = req.user?.id!

    const data = {  amount,
      date,
      categoryId,
      type,
      userId,
      description,
      startDate,
      endDate,receipt}
        const expense = await expenseService.createExpense(data)

    res.status(201).json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, categoryId, type } = req.query;
    const userId = req.user?.id
    const expenses = await expenseService.getExpenses(startDate as string | undefined, endDate  as string | undefined, categoryId  as number | undefined, type as string | undefined, Number(userId))
    console.log(expenses)
    res.json(expenses);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const userId = req.user?.id
    const expense = await expenseService.getExpenseById(Number(id),Number(userId))
    res.json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { amount, date, categoryId, type, description, startDate, endDate } =
      req.body;
    const { id } = req.params
    const userId = req.user?.id
      const newData = {
        amount,
        date,
        categoryId,
        type,
        description,
        startDate,
        endDate,
      } as Partial<CreateExpenseBody>
      if (req.file?.path) newData.receipt = req.file.path;
      const expense = await expenseService.updateExpense(Number(id) ,Number(userId) ,newData)

    res.json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const {id} = req.query
    const userId = req.user?.id
    expenseService.deleteExpense(Number(id),Number(userId))
    res.json({ message: "Expense deleted successfully" }).status(204);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
