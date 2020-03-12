import { Response } from 'express';
import { Request } from '../../middlewares/auth';

import Queue from '../../../lib/Queue';
import BuyMail from '../../jobs/BuyMail';

import Transaction from '../../models/Transaction';
import User from '../../models/User';

import MercadoBitcoinApi from '../../services/mercadobitcoin';

class BuyController {
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')
      const { amount_in_brl } = req.body;

      const bitcoin = {
        buy: Number(data.ticker.buy),
        sell: Number(data.ticker.sell)
      }

      const transactions = await Transaction.create({
        user_id: req.userId,
        type: 'debit',
        amount: Number(amount_in_brl),
      })

      const amountInBTC = Transaction.convertMoney({
        type: 'BRL_TO_BTC',
        amount: amount_in_brl,
        quote: bitcoin.buy
      });

      transactions.dataValues.children = await Transaction.create({
        user_id: req.userId,
        transaction_id: transactions.id,
        type: 'purchase',
        amount: amountInBTC,
        currency_type: 'BTC',
        currency_purchase_value_in_brl: bitcoin.buy,
        currency_liquidate_value_in_brl: bitcoin.sell
      })

      const user = await User.findByPk(req.userId)

      await Queue.add(BuyMail.key, {
        transaction: transactions,
        user
      });

      return res.json(transactions)
    } catch (error) {
      console.log(error)
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new BuyController();
