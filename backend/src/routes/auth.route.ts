import { Router } from "express";
import { signup, login, me } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authShema } from "../validator/auth.validator";
import { validateBody } from "../utils/validator";

const router = Router();

router.post("/signup", validateBody(authShema), signup);
router.post("/login", validateBody(authShema), login);
router.get("/me", authenticateJWT, me);

export default router;
