import { Request, Response } from "express";
import { categoryModel } from "../config/database";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = await categoryModel.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryModel.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
