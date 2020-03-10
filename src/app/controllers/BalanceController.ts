import { Response } from 'express';
import { Request } from '../middlewares/auth';

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
      const balance = await Transaction.getBalance({
        user_id: req.userId
      });

      return res.json({
        balance
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new BalanceController();
