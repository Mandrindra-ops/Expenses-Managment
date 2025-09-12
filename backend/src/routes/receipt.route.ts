import express from "express";
import { downloadReceiptController } from "../controllers/receipt.controller";

const router = express.Router();

router.get("/:expenseId", downloadReceiptController);

export default router;
