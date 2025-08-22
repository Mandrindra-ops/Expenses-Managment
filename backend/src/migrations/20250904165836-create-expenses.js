'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      expenseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      idCategory: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('one-time', 'recurring'),
        allowNull: false,
        defaultValue: 'one-time',
      },
      creationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      receiptPath: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      receiptType: {
        type: Sequelize.ENUM('jpg', 'png', 'pdf'),
        allowNull: true,
      },
      receiptUploadedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  },
};
