
require('dotenv').config();
import { Sequelize } from 'sequelize';
import { createExpenseModel } from '../models/expenseModel';
import { createAdminModel } from '../models/adminModel';
import { createCategoryModel } from '../models/categoryModel';
import { createIncomingTrackingModel } from '../models/incomeModel';
import { createUserModel } from '../models/userModel'; // new

// DB config
const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPassword = process.env.DB_PASSWORD!;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

// Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
});

// Models
export let expenseModel: any = null;
export let adminModel: any = null;
export let categoryModel: any = null;
export let incomingTracking: any = null;
export let userModel: any = null; // new

// DB connection + model initialization
export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Initialize models
    userModel = createUserModel(sequelize);
    expenseModel = createExpenseModel(sequelize);
    adminModel = createAdminModel(sequelize);
    categoryModel = createCategoryModel(sequelize);
    incomingTracking = createIncomingTrackingModel(sequelize);

    // Associations
    userModel.hasMany(expenseModel, { foreignKey: 'userId' });
    expenseModel.belongsTo(userModel, { foreignKey: 'userId' });

    categoryModel.hasMany(expenseModel, { foreignKey: 'idCategory' });
    expenseModel.belongsTo(categoryModel, { foreignKey: 'idCategory' });

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

export default sequelize;
