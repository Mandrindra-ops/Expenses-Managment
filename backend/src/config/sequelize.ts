// config/sequelize.ts
import { Sequelize } from 'sequelize';
import { config } from './index';

// Initialize Sequelize
export const sequelize: Sequelize = new Sequelize({
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
  logging: false, // disable SQL logs, set true for debugging
  models: [__dirname + '/../models'], // auto-load models
});
