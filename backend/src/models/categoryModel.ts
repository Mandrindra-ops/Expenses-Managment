 // models/category.ts
import { DataTypes, Sequelize } from 'sequelize';

export const createCategoryModel = (sequelize: Sequelize) => {
  const Category = sequelize.define('Category', {
    idCategory: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true, // no duplicate category names
      allowNull: false,
    },
  });

  return Category;
};
