// models/Admin.ts
// Sequelize-Typescript model for the `admins` table
// Requires: npm i sequelize-typescript bcryptjs && npm i -D @types/bcryptjs

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({
  tableName: 'admins',
  timestamps: false, // we only have created_at in the migration
})
export class Admin extends Model<Admin> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.STRING(255),
    validate: { isEmail: true },
  })
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string; // hashed value will be stored

  @Default('admin')
  @Column(DataType.STRING(50))
  role!: string; // e.g., 'admin' | 'superadmin'

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  // --- Hooks to hash password when creating/updating ---
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: Admin) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  // Helper to verify a plain text password against the stored hash
  async checkPassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }

  // Hide sensitive fields when converting to JSON
  toJSON() {
    const values = { ...this.get() } as Record<string, any>;
    delete values.password;
    return values;
  }
}
