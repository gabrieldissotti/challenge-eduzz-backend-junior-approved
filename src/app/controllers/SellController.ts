import { Response } from 'express';
import { Request } from '../middlewares/auth';
import errors from 'errors';
import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import SellMail from '../jobs/SellMail';

import Transaction from '../models/Transaction';
import User from '../models/User';

import MercadoBitcoinApi from '../services/mercadobitcoin';

class SellController {
  /**
   * @swagger
   *
   *
   * /sells:
   *    post:
   *      tags:
   *        - Bitcoin
   *      name: Buy currency
   *      summary: buy currency
   *      security:
   *        - bearerAuth: []
   *      produces:
   *        - application/json
   *      consumes:
   *        - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *            examples:
   *              Buy Bitcoin:
   *                value:
   *                  amount_in_btc: 25
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  total_liquidated_amount:
   *                    type: number
   *                  total_credited_amount:
   *                    type: number
   *                  liquidated:
   *                    type: array
   *                    items:
   *                      $ref: '#/definitions/Transaction'
   *                  credited:
   *                    type: array
   *                    items:
   *                      $ref: '#/definitions/Transaction'
   *                  reinvested:
   *                    $ref: '#/definitions/Transaction'
   *
   *        401:
   *          description: unauthorized
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: 'Insufficient money to debit'
   *        403:
   *          description: forbidden
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: 'Token not provided or inválid token'
   *        500:
   *          description: internal server error
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  error:
   *                    type: string
   *                    example: 'Timeout'
   */
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')
      const { amount_in_btc: sellAmount } = req.body;

      const bitcoin = {
        buy: Number(data.ticker.buy),
        sell: Number(data.ticker.sell)
      }

      const purchases = await Transaction.findAll({
        where: {
          user_id: req.userId,
          type: 'purchase',
          currency_type: 'BTC',
          status: 'normal'
        },
        include: [
          {
            model: Transaction,
            as: 'children',
          },
          {
            model: Transaction,
            as: 'parent',
          },
        ]
      })

      if (!purchases) {
        throw new errors.Http400Error({
          message: 'User doesn\'t have bitcoin investments'
        })
      }

      const btcBalance = await Transaction.getBalance({
        user_id: req.userId,
        currencyType: 'BTC'
      });

      if (btcBalance < sellAmount) {
        throw new errors.Http400Error({
          message: 'Insufficient BTC amount to sell'
        })
      }

      const toLiquidate = purchases.reduce((accumulator, current) => {
        if (Number(accumulator.total_amount) < Number(sellAmount)) {
          return {
            total_amount: Number(accumulator.total_amount) + Number(current.amount),
            rows: [
              ...accumulator.rows,
              current.dataValues
            ]
          }
        }
      }, {
        total_amount: 0,
        rows: []
      });

      await Transaction.update({
        status: 'liquidated'
      }, {
        where: {
          id: toLiquidate.rows.map(transaction => transaction.id)
        }
      })

      const creditLiquidations = toLiquidate.rows.map(transaction => ({
        type: 'credit',
        user_id: req.userId,
        transaction_id: transaction.id,
        amount: Transaction.convertMoney({
          type: 'BTC_TO_BRL',
          amount: Number(transaction.amount),
          quote: bitcoin.sell
        })
      }))

      const credited = await Transaction.bulkCreate(creditLiquidations, { validate: true })

      const fullLiquidationAmount = Number(toLiquidate.total_amount);

      let reinvestedTransaction;
      if (fullLiquidationAmount > Number(sellAmount)) {
        const brlReceived = Transaction.convertMoney({
          type: 'BTC_TO_BRL',
          amount: fullLiquidationAmount - Number(sellAmount),
          quote: bitcoin.sell
        });

        const debitTransaction = await Transaction.create({
          type: 'debit',
          user_id: req.userId,
          amount: Number(brlReceived),
          status: 'liquidated'
        })

        reinvestedTransaction = await Transaction.create({
          type: 'purchase',
          transaction_id: debitTransaction.id,
          currency_type: 'BTC',
          user_id: req.userId,
          amount: Transaction.convertMoney({
            type: 'BRL_TO_BTC',
            amount: Number(brlReceived),
            quote: bitcoin.buy
          })
        })
      }

      const response = {
        total_liquidated_amount: toLiquidate.rows.reduce((sum, actual) => Number(sum) + Number(actual.amount), 0).toFixed(8),
        total_credited_amount: credited.reduce((sum, actual) => Number(sum) + Number(actual.amount), 0).toFixed(8),
        liquidated: toLiquidate.rows,
        credited,
        reinvested: reinvestedTransaction,
      }

      const user = await User.findByPk(req.userId)

      await Queue.add(SellMail.key, {
        transactions: response,
        user
      });

      return res.json(response)
    } catch (error) {
      console.log(error)
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new SellController();
