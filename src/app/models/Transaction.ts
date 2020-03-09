import Sequelize from 'sequelize';
import { Model } from 'sequelize-typescript';

/**
 * @swagger
 *
 * definitions:
 *   Transaction:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       transaction_id:
 *         type: integer
 *       type:
 *         type: string
 *       amount:
 *         type: number
 *       date:
 *         type: string
 *       currency_type:
 *         type: string
 *       currency_purchase_value_in_brl:
 *         type: number
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 */
class Transaction extends Model {
  type?: string
  amount?: number
  id?: number
  user_id?: number
  transaction_id?: number
  date?: string
  currency_type?: string
  currency_purchase_value_in_brl?: number
  created_at?: string
  updated_at?: string

  static init (sequelize): any {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        transaction_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        amount: {
          type: Sequelize.DECIMAL(16, 8),
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        currency_type: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'BRL'
        },
        currency_purchase_value_in_brl: {
          type: Sequelize.DECIMAL(16, 8),
          allowNull: false,
          defaultValue: 1
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate (models): void {
    this.hasOne(models.Transaction, {
      foreignKey: 'transaction_id',
      as: 'transaction',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Transaction;
