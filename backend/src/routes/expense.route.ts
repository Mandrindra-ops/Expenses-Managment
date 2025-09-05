import { Router } from 'express';
import { createExpense } from '../controllers/expense.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

// Protéger la route et accepter un seul fichier nommé "receipt"
router.post('/', authenticateJWT, upload.single('receipt'), createExpense);

export default router;
