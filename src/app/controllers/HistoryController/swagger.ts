/**
 * @swagger
 *
 *
 * /histories:
 *    get:
 *      tags:
 *        - Bitcoin (BTC)
 *      name: History
 *      summary: show bitcoin history (sell and buy value) of last 24 hours
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
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    buy:
 *                      type: number
 *                    sell:
 *                      type: number
 *                    datetime:
 *                      type: string
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
