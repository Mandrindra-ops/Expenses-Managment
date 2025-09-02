import { Request, Response } from "express";
import { createExpenseModel } from "../models/expenseModel";
import { categoryModel as Category } from "../config/database";
import sequelize from "../config/database";

interface AuthRequest extends Request {
  user?: { userId: number };
}

// Initialize model once
const Expense = createExpenseModel(sequelize);

// GET /api/expenses
export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user?.userId } });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET /api/expenses/:id
export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const expenseItem = await Expense.findOne({
      where: { expenseId: req.params.id, userId: req.user?.userId },
    });
    if (!expenseItem) return res.status(404).json({ message: "Expense not found" });
    res.json(expenseItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// POST /api/expenses


export const createExpense = async (req, res) => {
  try {
    let { amount, type, date, description, categoryName, idCategory } = req.body;

    let categoryId = idCategory;

    // If no categoryId but user gave a categoryName → create or find it
    if (!categoryId && categoryName) {
      const [category] = await Category.findOrCreate({
        where: { name: categoryName },
        defaults: { isDefault: false },
      });
      categoryId = category.idCategory;
    }

    if (!amount || !type || !date || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await Expense.create({
      amount,
      type,
      date,
      description,
      idCategory: categoryId,
    });

    return res.status(201).json(expense);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};


// PUT /api/expenses/:id
export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const [updated] = await Expense.update(req.body, {
      where: { expenseId: req.params.id, userId: req.user?.userId },
    });
    if (!updated) return res.status(404).json({ message: "Expense not found" });
    const updatedExpense = await Expense.findOne({
      where: { expenseId: req.params.id, userId: req.user?.userId },
    });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Expense.destroy({
      where: { expenseId: req.params.id, userId: req.user?.userId },
    });
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
