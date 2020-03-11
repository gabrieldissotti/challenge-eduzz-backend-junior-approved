import { Response } from 'express';
import { Request } from '../middlewares/auth';
import * as Yup from 'yup';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Transaction from '../models/Transaction';

class BankStatementController {
  /**
   * @swagger
   *
   *
   * /bank-statements:
   *    get:
   *      tags:
   *        - Bitcoin
   *      name: Currency quotes
   *      summary: get currency quotes
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
   *        - in: query
   *          name: start_date
   *          schema:
   *            type: string
   *          description: default is today - 90 days
   *        - in: query
   *          name: end_date
   *          schema:
   *            type: string
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
   *                      $ref: '#/definitions/Transaction'
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
        start_date: Yup.string(),
        end_date: Yup.string(),
      });

      await schema.validate(req.body).catch((err) => {
        return res.status(400).json({ error: err.message || 'Validation fails' });
      })

      const {
        pagesize,
        page,
        start_date,
        end_date
      } = req.query;

      const limit = Number(pagesize || 30);

      const offset = page ? (Number(page) - 1) * limit : 0;

      const startDate = start_date ? new Date(start_date) : new Date();
      const todayLess90Days = new Date();
      todayLess90Days.setDate(startDate.getDate() - 90)

      const transactions = await Transaction.findAndCountAll({
        limit,
        offset,
        where: {
          user_id: req.userId,
          ...(start_date && !end_date
            ? { date: { [Op.gte]: startOfDay(startDate) } }
            : { date: { [Op.gte]: startOfDay(todayLess90Days) } }),
          ...(end_date && !start_date
            ? { date: { [Op.lte]: endOfDay(new Date(end_date)) } }
            : ''),
          ...(end_date && end_date
            ? {
              date: {
                [Op.between]: [
                  startOfDay(startDate),
                  endOfDay(new Date(end_date)),
                ],
              },
            }
            : ''),
        },
      })

      return res.json(transactions)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new BankStatementController();
