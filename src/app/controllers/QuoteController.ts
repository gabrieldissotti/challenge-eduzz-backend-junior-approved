import { Response } from 'express';
import { Request } from '../middlewares/auth';
import MercadoBitcoinApi from '../services/mercadobitcoin';

class QuoteController {
  /**
   * @swagger
   *
   *
   * /quotes:
   *    get:
   *      tags:
   *        - Bitcoin (BTC)
   *      name: Currency quotes
   *      summary: get currency quotes (sell and buy BRL values at moment)
   *      security:
   *        - bearerAuth: []
   *      produces:
   *        - application/json
   *      consumes:
   *        - application/json
   *      responses:
   *        200:
   *          description: success
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  bitcoin:
   *                    type: object
   *                    properties:
   *                      buy:
   *                        type: number
   *                      sell:
   *                        type: number
   *        403:
   *          description: forbidden
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: 'Token not provided or inválid token'
   *        500:
   *          description: internal server error
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  error:
   *                    type: string
   *                    example: 'Timeout'
   */
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
