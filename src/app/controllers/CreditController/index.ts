import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import * as Yup from 'yup';

import Transaction from '../../models/Transaction';
import User from '../../models/User';

import Queue from '../../../lib/Queue';
import DepositMail from '../../jobs/DepositMail';

class CreditController {
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const schema = Yup.object().shape({
        amount: Yup.number()
          .required(),
      });

      await schema.validate(req.body).catch((err) => {
        return res.status(400).json({ error: err.message || 'Validation fails' });
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

      return res.json(transaction);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new CreditController();
