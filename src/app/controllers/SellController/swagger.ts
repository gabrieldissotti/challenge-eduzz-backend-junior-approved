/**
 * @swagger
 *
 *
 * /sells:
 *    post:
 *      tags:
 *        - Bitcoin (BTC)
 *      name: Sell currency
 *      summary: Sell currency (BTC)
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
 *                  amount_in_btc: 0.00001
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  total_liquidated_amount:
 *                    type: number
 *                  total_credited_amount:
 *                    type: number
 *                  liquidated:
 *                    type: array
 *                    items:
 *                      $ref: '#/definitions/Transaction'
 *                  credited:
 *                    type: array
 *                    items:
 *                      $ref: '#/definitions/Transaction'
 *                  reinvested:
 *                    $ref: '#/definitions/Transaction'
 *
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
