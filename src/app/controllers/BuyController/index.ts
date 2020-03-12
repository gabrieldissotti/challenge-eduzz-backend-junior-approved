import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import logger from '../../../logger';

import Queue from '../../../lib/Queue';
import BuyMail from '../../jobs/BuyMail';

import Transaction from '../../models/Transaction';
import User from '../../models/User';

import MercadoBitcoinApi from '../../services/mercadobitcoin';

class BuyController {
  async store (req: Request, res: Response): Promise<Response> {
    const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')
    const { amount_in_brl } = req.body;

    if (!(Number(amount_in_brl) > 0.01)) {
      return res.status(400).json({ error: 'Amount minimum is 0.01' });
    }

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

    if (process.env.NODE_ENV !== 'test') {
      logger.info(`${user.name} <${user.email}> comprou ${amountInBTC} bitcoins (BTC) no valor de R$ ${amount_in_brl}`);
    }

    return res.json(transactions)
  }
}

export default new BuyController();
