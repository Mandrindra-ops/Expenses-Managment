import { DataTypes, Model, Optional } from 'sequelize';
import User from './user.model';
import sequelize from '../utils/database';


interface IncomeAttributes {
  id: number;
  amount: number;
  date: Date;
  source: string;
  description?: string;
  creationDate?: Date;
  userId: number;
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
  public userId!: number;
}


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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'Incomes',
    }
);


Income.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

export default Income;
