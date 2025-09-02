// Association
import {createUserModel } from '../models/userModel';
import { createExpenseModel } from '../models/expenseModel';
import sequelize from '../config/database';
const User = createUserModel(sequelize)
const Expense = createExpenseModel(sequelize);
User.hasMany(Expense, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE',  // si un user est effacé, les expenses le sont aussi
  onUpdate: 'CASCADE'
});

Expense.belongsTo(User, {
  foreignKey: 'userId'
});