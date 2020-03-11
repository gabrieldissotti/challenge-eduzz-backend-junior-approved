import { Response } from 'express';
import { Request } from '../middlewares/auth';
import { startOfDay, endOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Sequelize, { Op } from 'sequelize';

import Transaction from '../models/Transaction';

class VolumeController {
  /**
   * @swagger
   *
   *
   * /volumes:
   *    get:
   *      tags:
   *        - Bitcoin (BTC)
   *      name: Currency quotes
   *      summary: total bitcoins sold and bought today in BTC
   *      security:
   *        - bearerAuth: []
   *      produces:
   *        - application/json
   *      consumes:
   *        - application/json
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  buy:
   *                    type: number
   *                  sell:
   *                    type: number
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
      const today = new Date();

      const transactions = await Transaction.findAll({
        where: {
          user_id: req.userId,
          date: {
            [Op.between]: [
              startOfDay(today),
              endOfDay(today),
            ]
          },
          currency_type: 'BTC'
        },
        attributes: [
          'type',
          'status',
          [Sequelize.fn('sum', Sequelize.col('Transaction.amount')), 'amount']
        ],
        group: ['Transaction.status'],
      })

      const response = {
        buy: transactions.find(t => t.status === 'normal')?.amount || 0,
        sell: transactions.find(t => t.status === 'liquidated')?.amount || 0
      }

      return res.json(response)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new VolumeController();
