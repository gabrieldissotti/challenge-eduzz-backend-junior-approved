import { Response } from 'express';
import { Request } from '../middlewares/auth';

import Currency from '../models/Currency';
import { Op } from 'sequelize';

class HistoryController {
  /**
   * @swagger
   *
   *
   * /histories:
   *    get:
   *      tags:
   *        - History
   *      name: History
   *      summary: get bitcoin history
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
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    buy:
   *                      type: number
   *                    sell:
   *                      type: number
   *                    datetime:
   *                      type: string
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
      const date = new Date();
      const todayLess1Days = new Date();
      todayLess1Days.setDate(date.getDate() - 1)

      const currencies = await Currency.findAll({
        attributes: [
          'id',
          'sell',
          'buy',
          'datetime',
        ],
        where: {
          datetime: { [Op.gte]: todayLess1Days }
        }
      });

      return res.json(currencies)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new HistoryController();
