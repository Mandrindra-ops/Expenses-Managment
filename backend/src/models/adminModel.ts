import { DataType, DataTypes } from "sequelize";
export const createAdminModel = (sequelize) => {
    const Admin = sequelize.define('Admin',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Admin;
}   