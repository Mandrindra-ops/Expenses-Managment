// models/Income.ts
// Sequelize-Typescript model for the `incomes` table

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { User } from './userModel';

@Table({
  tableName: 'incomes',
  timestamps: false, // only created_at
})
export class Income extends Model<Income> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  date!: Date;

  @Column(DataType.STRING(255))
  source!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  // Relations
  @BelongsTo(() => User)
  user!: User;
}
