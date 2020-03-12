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
