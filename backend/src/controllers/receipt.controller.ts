import { Request, Response } from 'express';
import { downloadExpenseReceipt } from '../services/receipt.service';

/**
 * Controller to handle downloading an expense receipt
 */
export const downloadReceiptController = async (req: Request, res: Response) => {
  const expenseId = Number(req.params.expenseId);

  if (isNaN(expenseId)) {
    return res.status(400).json({ message: 'Invalid expense ID' });
  }

  // Call the service to handle the actual download
  await downloadExpenseReceipt(expenseId, res);
};

