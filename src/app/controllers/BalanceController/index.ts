import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import logger from '../../../logger';

import Transaction from '../../models/Transaction';

class BalanceController {
  async index (req: Request, res: Response): Promise<Response> {
    const balance = await Transaction.getBalance({
      user_id: req.userId,
      currencyType: 'BRL'
    });

    return res.json({
      balance
    })
  }
}

export default new BalanceController();
