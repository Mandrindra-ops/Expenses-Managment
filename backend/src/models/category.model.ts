import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database';

class Category extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public userId!: number; // Pour le user-scoped query
}

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
      unique: false, // La combinaison userId + name doit être unique
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'Categories',
    sequelize,
    indexes: [
      { unique: true, fields: ['name', 'userId'] } // nom unique par utilisateur
    ],
    timestamps: true,
  }
);

export default Category;
