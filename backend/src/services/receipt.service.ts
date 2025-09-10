import { Response } from 'express';
import Expense from '../models/expense.model';
import fs from 'fs';
import path from 'path';

/**
 * Service to download the receipt of an expense
 */
export const downloadExpenseReceipt = async (expenseId: number, res: Response) => {
  try {
    const expense = await Expense.findByPk(expenseId);
    if (!expense || !expense.receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    const uploadsFolder = path.join(__dirname, '../uploads/receipts');
    const filePath = path.join(uploadsFolder, expense.receipt);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File does not exist on server' });
    }

    res.download(filePath, expense.receipt, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Could not download the file' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
