const express = require("express");
import { createCategory, getCategories } from "../controllers/categorycontroller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Protect if needed with auth middleware
router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, getCategories);

export default router;
