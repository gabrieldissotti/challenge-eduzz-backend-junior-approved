import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import logger from '../../../logger';
import * as Yup from 'yup';

import Transaction from '../../models/Transaction';
import User from '../../models/User';

import Queue from '../../../lib/Queue';
import DepositMail from '../../jobs/DepositMail';

class CreditController {
  async store (req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      amount: Yup.number()
        .required(),
    });

    await schema.validate(req.body).catch((err) => {
      return res.status(400).json({ error: err.message });
    })

    const { amount } = req.body;

    if (!(Number(amount) > 0.01)) {
      return res.status(400).json({ error: 'Amount minimum is 0.01' });
    }

    if (!(Number(amount) < 99999999.99)) {
      return res.status(400).json({ error: 'Amount maximum is 99999999.99' });
    }

    const transaction = await Transaction.create({
      user_id: req.userId,
      type: 'credit',
      amount: Number(amount),
    })

    const user = await User.findByPk(req.userId)

    await Queue.add(DepositMail.key, { transaction, user });

    if (process.env.NODE_ENV !== 'test') {
      logger.info(`${user.name} <${user.email}> fez um depósito no valor de R$ ${transaction.amount}`);
    }

    return res.json(transaction);
  }
}

export default new CreditController();
