import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import MercadoBitcoinApi from '../../services/mercadobitcoin';
import logger from '../../../logger';

class QuoteController {
  async index (req: Request, res: Response): Promise<Response> {
    const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')

    const response = {
      bitcoin: {
        buy: data.ticker.buy,
        sell: data.ticker.sell
      }
    }

    return res.json(response)
  }
}

export default new QuoteController();
