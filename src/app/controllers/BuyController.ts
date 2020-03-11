import { Response } from 'express';
import { Request } from '../middlewares/auth';

import Queue from '../../lib/Queue';
import BuyMail from '../jobs/BuyMail';

import Transaction from '../models/Transaction';
import User from '../models/User';

import MercadoBitcoinApi from '../services/mercadobitcoin';

class BuyController {
  /**
   * @swagger
   *
   *
   * /buys:
   *    post:
   *      tags:
   *        - Bitcoin (BTC)
   *      name: Buy currency
   *      summary: buy bitcoin (BTC) amount with BRL
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
   *                  amount_in_brl: 25
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/definitions/BuyTransaction'
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
      const { amount_in_brl } = req.body;

      const bitcoin = {
        buy: Number(data.ticker.buy),
        sell: Number(data.ticker.sell)
      }

      const transactions = await Transaction.create({
        user_id: req.userId,
        type: 'debit',
        amount: Number(amount_in_brl),
      })

      const amountInBTC = Transaction.convertMoney({
        type: 'BRL_TO_BTC',
        amount: amount_in_brl,
        quote: bitcoin.buy
      });

      transactions.dataValues.children = await Transaction.create({
        user_id: req.userId,
        transaction_id: transactions.id,
        type: 'purchase',
        amount: amountInBTC,
        currency_type: 'BTC',
        currency_purchase_value_in_brl: bitcoin.buy,
        currency_liquidate_value_in_brl: bitcoin.sell
      })

      const user = await User.findByPk(req.userId)

      await Queue.add(BuyMail.key, {
        transaction: transactions,
        user
      });

      return res.json(transactions)
    } catch (error) {
      console.log(error)
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new BuyController();
