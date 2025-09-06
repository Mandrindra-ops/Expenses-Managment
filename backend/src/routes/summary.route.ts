import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticateJWT);

router.get('/monthly', getMonthlySummary);
router.get('/', getCustomSummary);
router.get('/alerts', getBudgetAlerts);

export default router;

