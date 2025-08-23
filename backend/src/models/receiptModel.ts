// models/Receipt.ts
// Sequelize-Typescript model for the `receipts` table

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
import { Expense } from './expenseModel';

@Table({
  tableName: 'receipts',
  timestamps: false, // only uploaded_at
})
export class Receipt extends Model<Receipt> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Expense)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  expense_id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  receipt_url!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  uploaded_at!: Date;

  // Relations
  @BelongsTo(() => Expense)
  expense!: Expense;
}
