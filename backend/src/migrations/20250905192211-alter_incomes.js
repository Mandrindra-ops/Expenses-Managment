'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     *
     */

        await queryInterface.addColumn("Incomes", 'userId', 
            { 
                type: Sequelize.INTEGER
                ,allowNull: false,
                references: {
                    model: "Users",
                    key: 'id',
                },
                onDelete: 'CASCADE',
            });
    },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.delete("Incomes","Income",'userId');
  }
};
