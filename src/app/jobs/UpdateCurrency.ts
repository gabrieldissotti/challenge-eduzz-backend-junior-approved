import cron from 'node-cron';

import '../../database';

import Currency from '../models/Currency';
import MercadoBitcoinApi from '../services/mercadobitcoin';
import { Op } from 'sequelize';

async function startUpdateCurrencyCron (): Promise<void> {
  console.log('startUpdateCurrencyCron');
  cron.schedule(
    '0 0-10-20-30-40-50/10 * * * *', // each 10 minutes (07:00 | 07:10 | 07:20)
    // '0-10-20-30-40-50/10 * * * * *', // each 10 seconds (07:00:00 | 07:00:10 | 07:00:20)
    async () => {
      const datetime = new Date();
      try {
        const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')

        const currency = {
          sell: data.ticker.sell,
          buy: data.ticker.buy,
          datetime,
        }

        console.log(currency)

        await Currency.create(currency);
        console.log('startUpdateCurrencyCron() - cron task executed succesfully');
      } catch (e) {
        console.log(e);
      }
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo',
    }
  );
}

async function startDeleteCurrencyCron (): Promise<void> {
  console.log('startDeleteCurrencyCron');
  cron.schedule(
    '00 00 00 * * *', // each day at 00 hours
    // '* * * * * *', // each second
    async () => {
      const datetime = new Date();
      const todayLess90Days = new Date();
      todayLess90Days.setDate(datetime.getDate() - 90)

      try {
        await Currency.destroy({
          where: {
            datetime: { [Op.gte]: todayLess90Days }
          }
        });
        console.log('startDeleteCurrencyCron() - cron task executed succesfully');
      } catch (e) {
        console.log(e);
      }
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo',
    }
  );
}
class UpdateCurrency {
  get key (): string {
    return 'UpdateCurrency';
  }

  async handle (): Promise<void> {
    startUpdateCurrencyCron()
    startDeleteCurrencyCron()
  }
}

export default new UpdateCurrency();
