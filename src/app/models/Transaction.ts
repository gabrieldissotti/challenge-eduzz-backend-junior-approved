import Sequelize, { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';
import errors from 'errors';

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
 *       currency_liquidate_value_in_brl:
 *         type: number
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 *   BuyTransaction:
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
 *       currency_liquidate_value_in_brl:
 *         type: number
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 *       transaction:
 *         $ref: '#/definitions/Transaction'
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
  currency_liquidate_value_in_brl?: number
  created_at?: string
  updated_at?: string
  transaction?: any
  dataValues?: any

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
        currency_liquidate_value_in_brl: {
          type: Sequelize.DECIMAL(16, 8),
          allowNull: false,
          defaultValue: 1
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (transaction: any) => {
      await this.validateUserBalance(transaction)
    });

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

  static async getBalance ({ user_id }): Promise<number> {
    const totalAmountByType = await this.findAll({
      where: {
        user_id,
        type: {
          [Op.in]: ['debit', 'credit']
        },
      },
      attributes: [
        'type',
        [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']
      ],
      group: ['type'],
    })

    const balance = totalAmountByType.reduce((balance, { type, amount }): any => {
      const match = {
        credit: Number(balance.amount) + Number(amount),
        debit: Number(balance.amount) - Number(amount)
      }

      return { amount: match[type] };
    }, {
      amount: 0
    })

    return Number(balance.amount)
  }

  static convertMoney ({ type, amount, quote }): number {
    const convert = {
      BRL_TO_BTC: Number(amount) / Number(quote),
      BTC_TO_BRL: Number(quote) * Number(amount),
    }

    return Number(convert[type].toFixed(8));
  }

  static async validateUserBalance (transaction: any): Promise<boolean> {
    if (transaction.type === 'debit') {
      const balance = await this.getBalance({
        user_id: transaction.user_id
      });

      if (balance <= 0 || balance < transaction.amount) {
        throw new errors.Http401Error({
          message: `Insufficient money to debit, sent ${transaction.amount} but has ${balance}`
        })
      }
    }

    return true;
  }
}

export default Transaction;
