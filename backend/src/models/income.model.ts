import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface IncomeAttributes {
  id: number;
  amount: number;
  date: Date;
  source: string;
  description?: string;
  creationDate?: Date;
  receiptPath?: string;
  receiptType?: 'jpg' | 'png' | 'pdf';
  receiptUploadedAt?: Date;
}

interface IncomeCreationAttributes extends Optional<IncomeAttributes, 'id' | 'creationDate'> {}

export class Income extends Model<IncomeAttributes, IncomeCreationAttributes>
  implements IncomeAttributes {
  public id!: number;
  public amount!: number;
  public date!: Date;
  public source!: string;
  public description?: string;
  public creationDate?: Date;
  public receiptPath?: string;
  public receiptType?: 'jpg' | 'png' | 'pdf';
  public receiptUploadedAt?: Date;
}

export const initIncomeModel = (sequelize: Sequelize) => {
  Income.init(
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
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      creationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      tableName: 'incomes',
      timestamps: true,
    }
  );
  return Income;
};
