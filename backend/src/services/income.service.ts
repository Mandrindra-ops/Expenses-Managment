import { Op } from "sequelize";
import { Income } from "../models/income.model";

type QueryParamsType = {
  userId: number;
  date?: { [Op.gte]?: any; [Op.lte]?: any };
};

export const createIncomeService = async (
  userId: number,
  amount: number,
  date: Date,
  source: string,
  description?: string
) => {
  return Income.create({
    amount,
    date,
    source,
    description,
    userId,
  });
};

export const getIncomesService = async (userId: number, start?: string, end?: string) => {
  let where: QueryParamsType = { userId };

  if (start || end) {
    let dateFilter: { [Op.gte]?: any; [Op.lte]?: any } = {};
    if (start) dateFilter[Op.gte] = start;
    if (end) dateFilter[Op.lte] = end;

    where = { ...where, date: dateFilter };
  }

  return Income.findAll({
    where,
    order: [["date", "DESC"]],
  });
};

export const getIncomeService = async (id: number, userId: number) => {
  return Income.findOne({
    where: { id, userId },
  });
};

export const updateIncomeService = async (id: number, userId: number, data: any) => {
  const income = await Income.findOne({ where: { id, userId } });
  if (!income) return null;

  await income.update(data);
  return income;
};

export const deleteIncomeService = async (id: number, userId: number) => {
  const income = await Income.findOne({ where: { id, userId } });
  if (!income) return null;

  await income.destroy();
  return true;
};
