import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import logger from '../../../logger';

import Currency from '../../models/Currency';
import { Op } from 'sequelize';

class HistoryController {
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
      logger.error(error.message)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new HistoryController();
