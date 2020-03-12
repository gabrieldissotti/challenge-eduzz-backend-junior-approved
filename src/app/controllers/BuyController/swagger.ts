/**
 * @swagger
 *
 *
 * /buys:
 *    post:
 *      tags:
 *        - Bitcoin (BTC)
 *      name: Buy currency
 *      summary: buy bitcoin (BTC) amount with BRL
 *      security:
 *        - bearerAuth: []
 *      produces:
 *        - application/json
 *      consumes:
 *        - application/json
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            examples:
 *              Buy Bitcoin:
 *                value:
 *                  amount_in_brl: 25
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/BuyTransaction'
 *        401:
 *          description: unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 'Insufficient money to debit'
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
