import { Router } from 'express';
import { createExpense, getExpenseById, getExpenses, updateExpense, deleteExpense } from '../controllers/expense.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';
import { validateMultipartExpense, validateParams, } from '../utils/validator';
import { idParamSchema } from '../validator/base.validator';

const router = Router();
router.use(authenticateJWT)

router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', upload.single('receipt'),validateMultipartExpense(false), createExpense);
router.put('/:id',upload.single("receipt"), validateParams(idParamSchema), updateExpense)
router.delete('/:id', validateParams(idParamSchema), deleteExpense)


export default router;
