import { Router } from "express";
import { authenticateJWT } from '../middlewares/auth.middleware';
import { createIncome, deleteIncome, getIncome, getIncomes, updateIncome } from "../controllers/income.controller";
import { validateBody, validateParams, validateQuery } from "../utils/validator";
import { createIncomeSchema, incomeQuerySchema, updateIncomeSchema } from "../validator/incomes.validator";
import { idParamSchema } from "../validator/base.validator";

const router = Router();

router.use(authenticateJWT);

router.get('/',validateQuery(incomeQuerySchema), getIncomes);
router.post('/',validateBody(createIncomeSchema), createIncome);
router.get('/:id',validateParams(idParamSchema), getIncome);
router.put('/:id',validateParams(idParamSchema),validateBody(updateIncomeSchema), updateIncome);
router.delete('/:id',validateParams(idParamSchema), deleteIncome);

export default router;
