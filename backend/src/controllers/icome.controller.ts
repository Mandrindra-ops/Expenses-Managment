import { Op } from "sequelize";
import { Income } from "../models/income.model";
import { Request,Response } from 'express';

const createIncome = async (req: Request, res: Response) => {
  try {
    const { amount, date, source, description } = req.body;

    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const income = await Income.create({
      amount,
      date,
      source,
      description,
      userId: user.id!,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getIncomes = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = { userId: req.user.id };

    if (start || end) {
      where.date = {};
      if (start) where.date[Op.gte] = start;
      if (end) where.date[Op.lte] = end;
    }

    const incomes = await Income.findAll({
      where,
      order: [['date', 'DESC']],
    });

    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    res.json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    await income.update(req.body);
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    await income.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

