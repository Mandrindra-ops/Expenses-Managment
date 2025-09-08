import { Router } from 'express';
import { createExpense, getExpenseById, getExpenses, updateExpense, deleteExpense } from '../controllers/expense.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';
import { validateMultipartExpense, validateQuery } from '../utils/validator';
import { expenseQuerySchema } from '../validator/expences.validator';
import { idParamSchema } from '../validator/base.validator';

const router = Router();
router.use(authenticateJWT)
// Protéger la route et accepter un seul fichier nommé "receipt"

router.get('/', validateQuery(expenseQuerySchema), getExpenses);
router.get('/:id', validateQuery(idParamSchema), getExpenseById);
router.post('/', upload.single('receipt'),validateMultipartExpense(false), createExpense);
router.put('/:id', validateQuery(idParamSchema), updateExpense)
router.delete('/:id', validateQuery(idParamSchema), deleteExpense)


export default router;
