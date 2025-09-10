import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import expenseRoutes from "./routes/expense.route";
import incomeRoutes from "./routes/income.route";
import sequelize from "./utils/database";
import summaryRoutes from "./routes/summary.route";

dotenv.config();

const app = express();

// Middlewares globaux
app.use(
  cors({
    origin: "http://localhost:5173", // pas "*", mettre l'URL exacte
    credentials: true, // pour autoriser les cookies / headers auth
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/receipt", downloadRoutes);

// Vérification de la connexion DB
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default app;
