const express = require("express");
import { register, login, getProfile } from "../controllers/userController";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/profile", getProfile);

export default router;
