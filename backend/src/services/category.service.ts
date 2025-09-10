import Category from '../models/category.model';

export const getAllCategories = async (userId: number) => {
  return Category.findAll({ where: { userId } });
};

export const getCategoryById = async (userId: number, id: number) => {
  return Category.findOne({ where: { userId, id } });
};

export const createCategory = async (userId: number, name: string, description?: string) => {
  return Category.create({ userId, name, description });
};

export const updateCategory = async (userId: number, id: number, name: string, description?: string) => {
  const category = await getCategoryById(userId, id);
  if (!category) throw new Error('Category not found');
  category.name = name;
  category.description = description;
  await category.save();
  return category;
};

export const deleteCategory = async (userId: number, id: number) => {
  const category = await getCategoryById(userId, id);
  if (!category) throw new Error('Category not found');
  await category.destroy();
  return true;
};
