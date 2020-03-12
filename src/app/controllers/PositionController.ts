import { Response } from 'express';
import { Request } from '../middlewares/auth';
import * as Yup from 'yup';

import Transaction from '../models/Transaction';

import MercadoBitcoinApi from '../services/mercadobitcoin';

class PositionController {
  /**
   * @swagger
   *
   *
   * /positions:
   *    get:
   *      tags:
   *        - Bitcoin (BTC)
   *      name: Currency quotes
   *      summary: list investments position
   *      security:
   *        - bearerAuth: []
   *      produces:
   *        - application/json
   *      consumes:
   *        - application/json
   *      parameters:
   *        - in: query
   *          name: page
   *          schema:
   *            type: integer
   *          default: 1
   *        - in: query
   *          name: pagesize
   *          schema:
   *            type: integer
   *          default: 30
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  count:
   *                    type: integer
   *                  rows:
   *                    type: array
   *                    items:
   *                      $ref: '#/definitions/Position'
   *
   *        400:
   *          description: bad request
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: 'Validation fails'
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
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const schema = Yup.object().shape({
        pagesize: Yup.number().integer(),
        page: Yup.number().integer(),
      });

      await schema.validate(req.body).catch((err) => {
        return res.status(400).json({ error: err.message || 'Validation fails' });
      })

      const {
        pagesize,
        page,
      } = req.query;

      const limit = Number(pagesize || 30);

      const offset = page ? (Number(page) - 1) * limit : 0;

      const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')

      const transactions = await Transaction.findAndCountAll({
        limit,
        offset,
        where: {
          type: 'purchase',
          user_id: req.userId,
          status: 'normal'
        },
        include: [
          {
            model: Transaction,
            as: 'parent'
          },
        ]
      })

      if (!(transactions?.rows?.length > 0)) {
        return res.json(transactions);
      }

      const response = {
        count: transactions.count,
        rows: transactions.rows.map(transaction => ({
          id: transaction.id,
          currency_purchase_value_in_brl: transaction.currency_purchase_value_in_brl,
          currency_liquidate_value_in_brl: transaction.currency_liquidate_value_in_brl,
          current_currency_purchase_value_in_brl: data.ticker.buy,
          current_currency_liquidate_value_in_brl: data.ticker.sell,
          purchased_brl_amount: transaction.parent.amount,
          current_brl_amount: Transaction.convertMoney({
            type: 'BTC_TO_BRL',
            amount: transaction.amount,
            quote: data.ticker.sell,
          }),
          btc_variation: Transaction.getVariation({
            initialValue: transaction.currency_purchase_value_in_brl,
            currentValue: data.ticker.buy
          }),
          date: transaction.date,
        }))
      }

      return res.json(response)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new PositionController();
