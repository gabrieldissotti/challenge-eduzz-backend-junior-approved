import { Request, Response } from 'express';

import User from '../models/User';
import Transaction from '../models/Transaction';

class TestController {
  /**
   * @swagger
   *
   * /tests:
   *    get:
   *      tags:
   *        - test
   *      name: List test
   *      summary: list all tests
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
   *                  $ref: '#/definitions/User'
   */
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        include: [{
          model: Transaction,
          as: 'transactions'
        }]
      });

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new TestController();
