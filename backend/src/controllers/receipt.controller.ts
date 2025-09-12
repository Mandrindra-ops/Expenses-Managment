import { Request, Response } from "express";
import { downloadExpenseReceipt } from "../services/receipt.service";

/**
 * Controller: call the service to handle receipt download
 */
export const downloadReceiptController = async (req: Request, res: Response) => {
  try {
    const expenseId = Number(req.params.expenseId);

    if (isNaN(expenseId)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    await downloadExpenseReceipt(expenseId, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
