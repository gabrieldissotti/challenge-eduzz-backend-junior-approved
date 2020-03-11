'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'transactions',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM([
          'debit',
          'credit',
          'purchase'
        ]),
        allowNull: false,
      },

      amount: {
        type: Sequelize.DECIMAL(16, 8),
        allowNull: false,
      },
      currency_type: {
        type: Sequelize.ENUM([
          'BRL',
          'BTC'
        ]),
        allowNull: false,
        defaultValue: 'BRL'
      },
      status: {
        type: Sequelize.ENUM([
          'normal',
          'liquidated'
        ]),
        allowNull: false,
        defaultValue: 'normal'
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      currency_purchase_value_in_brl: {
        type: Sequelize.DECIMAL(16, 8),
        allowNull: false,
        defaultValue: 1
      },
      currency_liquidate_value_in_brl: {
        type: Sequelize.DECIMAL(16, 8),
        allowNull: false,
        defaultValue: 1
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('transactions');
  },
};
