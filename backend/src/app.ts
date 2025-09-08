import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import expenseRoutes from "./routes/expense.route";
import incomeRoutes from "./routes/income.route";
import sequelize from "./utils/database";
import summaryRoutes from "./routes/summary.route";
<<<<<<< HEAD
=======
import userRoutes from './routes/user.route'
import receiptRoutes from './routes/receipt.route'

>>>>>>> ca27d1d ([fix] fix receipt uploads with secure replace and TS type fixes)

dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/summary", summaryRoutes);
<<<<<<< HEAD
=======
app.use('/api/user', userRoutes);
app.use('/api/receipts', receiptRoutes);
>>>>>>> ca27d1d ([fix] fix receipt uploads with secure replace and TS type fixes)

// Vérification de la connexion DB
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default app;
