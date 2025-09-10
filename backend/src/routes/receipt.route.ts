import { Router } from 'express';
import { downloadReceiptController } from '../controllers/receipt.controller';

const router = Router();

// Route calls the controller
router.get('/:expenseId', downloadReceiptController);

export default router;
