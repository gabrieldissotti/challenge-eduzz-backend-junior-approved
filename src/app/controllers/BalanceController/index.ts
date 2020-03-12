import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import logger from '../../../logger';

import Transaction from '../../models/Transaction';

class BalanceController {
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const balance = await Transaction.getBalance({
        user_id: req.userId,
        currencyType: 'BRL'
      });

      return res.json({
        balance
      })
    } catch (error) {
      console.log(error)
      logger.error(error.message)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new BalanceController();
