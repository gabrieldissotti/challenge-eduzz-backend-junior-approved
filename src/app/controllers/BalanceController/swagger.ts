/**
 * @swagger
 *
 *
 * /balances:
 *    get:
 *      tags:
 *        - Real (BRL)
 *      name: Balance
 *      summary: get user balance in BRL
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
 *                  amount:
 *                    type: string
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
