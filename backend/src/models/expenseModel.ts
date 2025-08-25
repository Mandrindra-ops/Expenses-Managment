import { DataTypes, Sequelize } from 'sequelize';

export const createExpenseModel = (sequelize: Sequelize) => {
  const Expense = sequelize.define('Expense', {
    expenseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true, // required only for one-time
    },
    idCategory: {
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
      allowNull: true, // required only for recurring
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Optional receipt
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
  });

  return Expense;
};
