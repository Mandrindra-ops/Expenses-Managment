import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface ExpenseAttributes {
  id: number;
  amount: number;
  date?: Date;
  categoryId: number;
  description?: string;
  type: 'one-time' | 'recurring';
  creationDate?: Date;
  startDate?: Date;
  endDate?: Date;
  receiptPath?: string;
  receiptType?: 'jpg' | 'png' | 'pdf';
  receiptUploadedAt?: Date;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, "id" | "creationDate"> {}

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes {
  public id!: number;
  public amount!: number;
  public date?: Date;
  public categoryId!: number;
  public description?: string;
  public type!: 'one-time' | 'recurring';
  public creationDate?: Date;
  public startDate?: Date;
  public endDate?: Date;
  public receiptPath?: string;
  public receiptType?: 'jpg' | 'png' | 'pdf';
  public receiptUploadedAt?: Date;
}

export const initExpenseModel = (sequelize: Sequelize) => {
  Expense.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('one-time', 'recurring'),
        allowNull: false,
        defaultValue: 'one-time',
      },
      creationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      receiptPath: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      receiptType: {
        type: DataTypes.ENUM('jpg', 'png', 'pdf'),
        allowNull: true,
      },
      receiptUploadedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'expenses',
      timestamps: true,
    }
  );
  return Expense;
};
