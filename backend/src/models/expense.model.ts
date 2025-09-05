import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';
import User from './user.model';
import Category from './category.model';

interface ExpenseAttributes {
  id: number;
  amount: number;
  date?: string;
  description?: string;
  type: 'OneTime' | 'Recurring';
  receipt?: string;
  startDate?: string;
  endDate?: string;
  userId: number;
  categoryId: number;
}

// `id` sera auto-généré donc optionnel lors de la création
interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id'> {}

class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes {
  public id!: number;
  public amount!: number;
  public date?: string;
  public description?: string;
  public type!: 'OneTime' | 'Recurring';
  public receipt?: string;
  public startDate?: string;
  public endDate?: string;
  public userId!: number;
  public categoryId!: number;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('OneTime', 'Recurring'),
      allowNull: false,
      defaultValue: 'OneTime',
    },
    receipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'Expenses',
    sequelize,
  }
);

// Relations
Expense.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Expense.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'CASCADE' });

export default Expense;
