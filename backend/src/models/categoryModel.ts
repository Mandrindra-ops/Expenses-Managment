
import { DataTypes, Sequelize } from "sequelize";

export const createCategoryModel = (sequelize: Sequelize) => {
  const Category = sequelize.define("Category", {
    idCategory: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "Categories",
    timestamps: true,
  });

  return Category;
};
