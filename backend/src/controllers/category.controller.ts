import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const listCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const categories = await categoryService.getAllCategories(userId);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const category = await categoryService.createCategory(userId, name, description);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const updated = await categoryService.updateCategory(userId, parseInt(id), name, description);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await categoryService.deleteCategory(userId, parseInt(id));
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
