'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('OneTime', 'Recurring'),
        allowNull: false,
        defaultValue: 'OneTime',
      },
      receipt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  },
};
