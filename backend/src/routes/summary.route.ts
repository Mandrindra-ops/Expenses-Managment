import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import {
  getBudgetAlerts,
  getCustomSummary,
  getMonthlySummary,
} from "../controllers/summary.controller";
import { validateQuery } from "../utils/validator";
import { monthlyQuerySchema, summaryQuerySchema } from "../validator/summary.validator";

const router = Router();
router.use(authenticateJWT);

router.get("/monthly", validateQuery(monthlyQuerySchema), getMonthlySummary);
router.get("/", validateQuery(summaryQuerySchema) ,getCustomSummary);
router.get("/alerts", getBudgetAlerts);

export default router;
