import { Request, Response } from "express";
import Expense from "../models/expense.model";
import fs from "fs/promises";

interface CreateExpenseBody {
  amount: number;
  date?: string;
  categoryId: number;
  type?: "OneTime" | "Recurring";
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Create Expense
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all expenses (with optional filters)
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, categoryId, type } = req.query;

    const whereClause: any = { userId: req.user!.id };

    if (startDate && endDate) {
      whereClause.date = { $between: [startDate, endDate] };
    }

    if (categoryId) whereClause.categoryId = categoryId;
    if (type) whereClause.type = type;

    const expenses = await Expense.findAll({ where: whereClause });
    res.json(expenses);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single expense
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update expense
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const { amount, date, categoryId, type, description, startDate, endDate } =
      req.body;

    if (req.file?.path) expense.receipt = req.file.path;

    await expense.update({
      amount,
      date,
      categoryId,
      type,
      description,
      startDate,
      endDate,
    });

    res.json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete expense
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.receipt) {
      try {
        await fs.unlink(expense.receipt);
      } catch (unlinkError) {
<<<<<<< HEAD
        console.error("Error deleting receipt file:", unlinkError);
=======
        console.error('Error deleting receipt file:', unlinkError);
>>>>>>> 7d23df9 ([fix] add unlink receipt on delete if)
      }
    }

    await expense.destroy();
    res.json({ message: "Expense deleted successfully" }).status(204);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // Get all expenses (with optional filters)
// export const getExpenses = async (req: Request, res: Response) => {
//   try {
//     const { startDate, endDate, categoryId, type } = req.query;

//     const whereClause: any = { userId: req.user!.id };

//     if (startDate && endDate) {
//       whereClause.date = { $between: [startDate, endDate] };
//     }

//     if (categoryId) whereClause.categoryId = categoryId;
//     if (type) whereClause.type = type;

//     const expenses = await Expense.findAll({ where: whereClause });
//     res.json(expenses);
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Get single expense
// export const getExpenseById = async (req: Request, res: Response) => {
//   try {
//     const expense = await Expense.findOne({
//       where: { id: req.params.id, userId: req.user!.id },
//     });

//     if (!expense) return res.status(404).json({ message: 'Expense not found' });

//     res.json(expense);
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Update expense
// export const updateExpense = async (req: Request, res: Response) => {
//   try {
//     const expense = await Expense.findOne({
//       where: { id: req.params.id, userId: req.user!.id },
//     });

//     if (!expense) return res.status(404).json({ message: 'Expense not found' });

//     const { amount, date, categoryId, type, description, startDate, endDate } =
//       req.body;

//     if (req.file?.path) expense.receipt = req.file.path;

//     await expense.update({
//       amount,
//       date,
//       categoryId,
//       type,
//       description,
//       startDate,
//       endDate,
//     });

//     res.json(expense);
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Delete expense
// export const deleteExpense = async (req: Request, res: Response) => {
//   try {
//     const expense = await Expense.findOne({
//       where: { id: req.params.id, userId: req.user!.id },
//     });

//     if (!expense) {

//       return res.status(404).json({ message: 'Expense not found' })
//     };
//     if (expense.receipt) {
//      // TODO:destroy receipt

//     }

//     await expense.destroy();
//     res.json({ message: 'Expense deleted successfully' }).status(204);
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
