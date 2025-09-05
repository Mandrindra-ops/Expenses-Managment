import { Router } from "express";
import { authenticateJWT } from '../middlewares/auth.middleware';
import { createIncome, deleteIncome, getIncome, getIncomes, updateIncome } from "../controllers/income.controller";

const router = Router();

router.use(authenticateJWT);

router.get('/', getIncomes);
router.post('/', createIncome);
router.get('/:id', getIncome);
router.put('/:id',updateIncome);
router.delete('/:id', deleteIncome);

export default router;
