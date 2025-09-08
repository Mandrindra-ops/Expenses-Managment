import { Request, Response } from "express";
import { createIncomeService, getIncomesService, getIncomeService, updateIncomeService, deleteIncomeService } from "../services/income.service";

export const createIncome = async (req: Request, res: Response) => {
  try {
    const { amount, date, source, description } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const income = await createIncomeService(user.id, amount, date, source, description);
    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getIncomes = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.validatedQuery;
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const incomes = await getIncomesService(user.id, start as string, end as string);
    res.json(incomes);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getIncome = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    console.log(id)
    const income = await getIncomeService(parseInt(id,10), user.id);
    if (!income) return res.status(404).json({ error: "Income not found" });

    res.json(income);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const income = await updateIncomeService(Number(req.params.id), user.id, req.body);
    if (!income) return res.status(404).json({ error: "Income not found" });

    res.json(income);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const deleted = await deleteIncomeService(Number(req.params.id), user.id);
    if (!deleted) return res.status(404).json({ error: "Income not found" });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};
