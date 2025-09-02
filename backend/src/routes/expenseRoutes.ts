const express = require("express");
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadReceipt } from "../config/multer";
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";

const router = require("express").Router();

// ✅ All routes require authentication
router.use(authMiddleware);

// GET /api/expenses -> list all expenses of the logged-in user
router.get("/", getExpenses);

// GET /api/expenses/:id -> get one expense by ID
router.get("/:id", getExpenseById);

// POST /api/expenses -> add a new expense (with optional receipt upload)
router.post("/", uploadReceipt.single("receipt"), createExpense);

// PUT /api/expenses/:id -> update an expense (with optional receipt upload)
router.put("/:id", uploadReceipt.single("receipt"), updateExpense);

// DELETE /api/expenses/:id -> remove an expense
router.delete("/:id", deleteExpense);

export default router;




