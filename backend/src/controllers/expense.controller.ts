import { Request, Response } from "express";
<<<<<<< HEAD
import * as expenseService from "../services/expense.service";
=======
import * as expenseService from '../services/expense.service';
import { da } from "zod/v4/locales/index.cjs";
>>>>>>> c701e27 ([fix] change validator income and expense)

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
    const userId = req.user?.id!;

    const data = {
      amount,
      date,
      categoryId,
      type,
      userId,
      description,
      startDate,
<<<<<<< HEAD
      endDate,
      receipt,
    };
=======
      endDate,receipt}
    res.json(data)
    const expense = await expenseService.createExpense(data)
>>>>>>> c701e27 ([fix] change validator income and expense)

    const expense = await expenseService.createExpense(data);
    res.status(201).json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, categoryId, type } = req.query;
<<<<<<< HEAD
    const userId = req.user?.id;
    const expenses = expenseService.getExpenses(
      String(startDate),
      String(endDate),
      Number(categoryId),
      String(type),
      Number(userId)
    );
=======
    const userId = req.user?.id
    const expenses = await expenseService.getExpenses(startDate as string | undefined, endDate  as string | undefined, categoryId  as number | undefined, type as string | undefined, Number(userId))
    console.log(expenses)
>>>>>>> c701e27 ([fix] change validator income and expense)
    res.json(expenses);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
<<<<<<< HEAD
    const { id } = req.query;
    const userId = req.user?.id;
    const expense = await expenseService.getExpenseById(
      Number(id),
      Number(userId)
    );
=======
    const {id} = req.params
    const userId = req.user?.id
    const expense = await expenseService.getExpenseById(Number(id),Number(userId))
>>>>>>> c701e27 ([fix] change validator income and expense)
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
    const { id } = req.query;
    const userId = req.user?.id;

    const newData = {
      amount,
      date,
      categoryId,
      type,
      description,
      startDate,
      endDate,
    } as Partial<CreateExpenseBody>;
    if (req.file?.path) newData.receipt = req.file.path;

    const expense = await expenseService.updateExpense(
      Number(id),
      Number(userId),
      newData
    );

    res.json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
        console.error("Error deleting receipt file:", unlinkError);
      }
    }

    await expense.destroy();
    const { id } = req.query;
    const userId = req.user?.id;
    expenseService.deleteExpense(Number(id), Number(userId));
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
