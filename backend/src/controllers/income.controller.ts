import { Op } from "sequelize";
import { Income } from "../models/income.model";
import { Request, Response } from "express";

type QueryParamsType = {
  userId: number;
  date?: { [Op.gte]?: any; [Op.lte]?: any };
};
export const createIncome = async (req: Request, res: Response) => {
  try {
    const {  amount, date, source, description } = req.body;

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const income = await Income.create({
            amount,
            date,
            source,
            description,
            userId: user?.id,
    });

    res.status(201).json(income);
  } catch (error) {
    console.log(error)
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getIncomes = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    let userId: number;

    userId = req.user?.id!;
    let where: QueryParamsType = { userId };
    if (start || end) {
      if (start) where = { ...where, date: { [Op.gte]: start } };
      if (end) where = { ...where, date: { [Op.gte]: end } };
    }

    const incomes = await Income.findAll({
      where,
      order: [["date", "DESC"]],
    });

    res.json(incomes);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const getIncome = async (req: Request, res: Response) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user?.id },
    });

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.json(income);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user?.id },
    });

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    await income.update(req.body);
    res.json(income);
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user?.id },
    });

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    await income.destroy();
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
  }
};
