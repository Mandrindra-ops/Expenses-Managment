import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface CategoryAttributes {
  id: number;
  name: string;
  description?: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initCategoryModel = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
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
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: true,
    }
  );
  return Category;
};
