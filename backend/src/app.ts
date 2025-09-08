import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import expenseRoutes from "./routes/expense.route";
import incomeRoutes from "./routes/income.route";
import sequelize from "./utils/database";
import summaryRoutes from "./routes/summary.route";
import userRoutes from './routes/user.route'
import receiptRoutes from './routes/receipt.route'


dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/summary", summaryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/receipts', receiptRoutes);

// Vérification de la connexion DB
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default app;
