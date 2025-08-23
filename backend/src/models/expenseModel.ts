// models/Expense.ts
// Sequelize-Typescript model for the `expenses` table

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
import { Category } from './categoryModel';

@Table({
  tableName: 'expenses',
  timestamps: false, // only created_at
})
export class Expense extends Model<Expense> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id!: number | null;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  date!: Date;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.STRING(50))
  type!: string;

  @Column(DataType.DATEONLY)
  start_date!: Date;

  @Column(DataType.DATEONLY)
  end_date!: Date;

  @Column(DataType.TEXT)
  receipt_url!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  // Relations
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Category)
  category!: Category;
}
