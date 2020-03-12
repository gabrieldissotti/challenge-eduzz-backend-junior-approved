import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import * as Yup from 'yup';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import logger from '../../../logger';

import Transaction from '../../models/Transaction';

class BankStatementController {
  async index (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      pagesize: Yup.number().integer(),
      page: Yup.number().integer(),
      start_date: Yup.string(),
      end_date: Yup.string(),
    });

    await schema.validate(req.body).catch((err) => {
      return res.status(400).json({ error: err.message });
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
        ...(start_date && end_date
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
  }
}

export default new BankStatementController();
