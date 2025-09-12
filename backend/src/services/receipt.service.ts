import Expense from "../models/expense.model";
import fs from "fs";
import path from "path";
import { Response } from "express";

/**
 * Service to download the receipt of an expense
 */
export const downloadExpenseReceipt = async (expenseId: number, res: Response) => {
  const expense = await Expense.findByPk(expenseId);

  if (!expense || !expense.receipt) {
    return res.status(404).json({ message: "Receipt not found" });
  }

  const filePath = expense.receipt;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File does not exist on server" });
  }

  // Nom de fichier propre
  const fileName = path.basename(filePath);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Could not download the file" });
      }
    }
  });
};
