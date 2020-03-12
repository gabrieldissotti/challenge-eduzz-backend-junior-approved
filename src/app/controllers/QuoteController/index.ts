import { Response } from 'express';
import { Request } from '../../middlewares/auth';
import MercadoBitcoinApi from '../../services/mercadobitcoin';

class QuoteController {
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const { data } = await MercadoBitcoinApi.get('/BTC/ticker/')

      const response = {
        bitcoin: {
          buy: data.ticker.buy,
          sell: data.ticker.sell
        }
      }

      return res.json(response)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new QuoteController();
