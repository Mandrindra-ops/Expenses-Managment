// models/Category.ts
// Sequelize-Typescript model for the `categories` table

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
  tableName: 'categories',
  timestamps: false, // only created_at is stored
})
export class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  // Relations
  @BelongsTo(() => User)
  user!: User;
}
