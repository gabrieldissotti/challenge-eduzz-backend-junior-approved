import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import logger from '../../../logger';
import errors from 'errors';

import Queue from '../../../lib/Queue';
import SellMail from '../../jobs/SellMail';

import Transaction from '../../models/Transaction';
import User from '../../models/User';

import MercadoBitcoinApi from '../../services/mercadobitcoin';

class SellController {
  async store (req: Request, res: Response): Promise<Response> {
    const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')
    const { amount_in_btc: sellAmount } = req.body;

    if (!(Number(sellAmount) > 0.00000001)) {
      return res.status(400).json({ error: 'Amount minimum is 0.00000001' });
    }

    const bitcoin = {
      buy: Number(data.ticker.buy),
      sell: Number(data.ticker.sell)
    }

    const purchases = await Transaction.findAll({
      where: {
        user_id: req.userId,
        type: 'purchase',
        currency_type: 'BTC',
        status: 'normal'
      },
      include: [
        {
          model: Transaction,
          as: 'children',
        },
        {
          model: Transaction,
          as: 'parent',
        },
      ]
    })

    if (!purchases) {
      throw new errors.Http400Error({
        message: 'User doesn\'t have bitcoin investments'
      })
    }

    const btcBalance = await Transaction.getBalance({
      user_id: req.userId,
      currencyType: 'BTC'
    });

    if (Number(btcBalance) < Number(sellAmount)) {
      throw new errors.Http400Error({
        message: 'Insufficient BTC amount to sell'
      })
    }

    const toLiquidate = purchases.reduce((accumulator, current) => {
      if (accumulator && Number(accumulator.total_amount) < Number(sellAmount)) {
        return {
          total_amount: Number(accumulator.total_amount) + Number(current.amount),
          rows: [
            ...accumulator.rows,
            current.dataValues
          ]
        }
      }

      return accumulator;
    }, {
      total_amount: 0,
      rows: []
    });

    await Transaction.update({
      status: 'liquidated'
    }, {
      where: {
        id: toLiquidate.rows.map(transaction => transaction.id)
      }
    })

    const creditLiquidations = toLiquidate.rows.map(transaction => ({
      type: 'credit',
      user_id: req.userId,
      transaction_id: transaction.id,
      amount: Transaction.convertMoney({
        type: 'BTC_TO_BRL',
        amount: Number(transaction.amount),
        quote: bitcoin.sell
      })
    }))

    const credited = await Transaction.bulkCreate(creditLiquidations, { validate: true })

    const fullLiquidationAmount = Number(toLiquidate.total_amount);

    let reinvestedTransaction;
    if (fullLiquidationAmount > Number(sellAmount)) {
      const brlReceived = Transaction.convertMoney({
        type: 'BTC_TO_BRL',
        amount: fullLiquidationAmount - Number(sellAmount),
        quote: bitcoin.sell
      });

      const debitTransaction = await Transaction.create({
        type: 'debit',
        user_id: req.userId,
        amount: Number(brlReceived),
        status: 'liquidated'
      })

      reinvestedTransaction = await Transaction.create({
        type: 'purchase',
        transaction_id: debitTransaction.id,
        currency_type: 'BTC',
        user_id: req.userId,
        amount: Transaction.convertMoney({
          type: 'BRL_TO_BTC',
          amount: Number(brlReceived),
          quote: bitcoin.buy
        })
      })
    }

    const response = {
      total_liquidated_amount: toLiquidate.rows.reduce((sum, actual) => Number(sum) + Number(actual.amount), 0).toFixed(8),
      total_credited_amount: credited.reduce((sum, actual) => Number(sum) + Number(actual.amount), 0).toFixed(8),
      liquidated: toLiquidate.rows,
      credited,
      reinvested: reinvestedTransaction,
    }

    const user = await User.findByPk(req.userId)

    await Queue.add(SellMail.key, {
      transactions: response,
      user
    });

    if (process.env.NODE_ENV !== 'test') {
      logger.info(`${user.name} <${user.email}> vendeu ${response.total_liquidated_amount} bitcoins (BTC) no valor de R$ ${response.total_credited_amount}`);
    }

    return res.json(response)
  }
}

export default new SellController();
