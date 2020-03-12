import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import { startOfDay, endOfDay } from 'date-fns';
import logger from '../../../logger';

import Sequelize, { Op } from 'sequelize';

import Transaction from '../../models/Transaction';

class VolumeController {
  async index (req: Request, res: Response): Promise<Response> {
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
  }
}

export default new VolumeController();
