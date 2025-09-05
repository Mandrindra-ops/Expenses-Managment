
import { Router } from 'express';
// import { createExpense, getExpenseById, getExpenses, updateExpense, deleteExpense } from '../controllers/expense.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
// import upload from '../middlewares/upload.middleware';

const router = Router();

// Protéger la route et accepter un seul fichier nommé "receipt"
router.post('/', authenticateJWT, upload.single('receipt' , createIncome);
router.get('/', authenticateJWT, getIncomes);
router.get('/:id', authenticateJWT, getExpenseById);
router.put('/:id', authenticateJWT, updateExpense)
router.delete('/:id', authenticateJWT, deleteExpense)


export default router;
