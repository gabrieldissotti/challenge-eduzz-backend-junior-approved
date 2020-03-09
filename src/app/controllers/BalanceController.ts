import { Response } from 'express';
import { Request } from '../middlewares/auth';
import Sequelize, { Op } from 'sequelize';

import Transaction from '../models/Transaction';

class BalanceController {
  /**
   * @swagger
   *
   *
   * /balances:
   *    get:
   *      tags:
   *        - Balance
   *      name: Balance
   *      summary: get user balance
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
   *                  amount:
   *                    type: string
   *        401:
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
      const totalAmountByType = await Transaction.findAll({
        where: {
          user_id: req.userId,
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

      return res.json(balance)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new BalanceController();
