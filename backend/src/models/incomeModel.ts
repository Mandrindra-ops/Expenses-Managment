import { DataType, DataTypes } from "sequelize";
export const createIncomingTrackingModel = (sequelize) => {
  const IncomingTracking = sequelize.define('IncomingTracking', {
    idIncoming: {
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
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
     // 👇 Optional receipt fields
    receiptPath: {
      type: DataTypes.TEXT,
      allowNull: true, // receipt is optional
    },
    receiptType: {
      type: DataTypes.ENUM('jpg', 'png', 'pdf'),
      allowNull: true, // receipt is optional
    },
    receiptUploadedAt: {
      type: DataTypes.DATE,
      allowNull: true, // set only when user uploads
    },
  });
  return IncomingTracking;
};