import fs from "fs";
import path from "path";
import mime from "mime-types";
import { Response } from "express";
import Expense from "../models/expense.model";

export const downloadExpenseReceipt = async (expenseId: number, res: Response) => {
  try {
    const expense = await Expense.findByPk(expenseId);
    if (!expense || !expense.receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    const filePath = expense.receipt;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File does not exist on server" });
    }

    const fileName = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    fs.createReadStream(filePath).pipe(res);

  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: "Server error" });
  }
};

