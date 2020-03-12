/**
 * @swagger
 *
 *
 * /credits:
 *    post:
 *      tags:
 *        - Real (BRL)
 *      name: Credit money
 *      summary: credit money (deposit) in BRL
 *      description: "
 *
 *  - The amount must be between 0.01 and 99999999.99
 *
 * "
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
 *              R$ 25:
 *                value:
 *                  amount: 25
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Transaction'
 *        400:
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 'Validation fails, check if sent parameters are correctly!'
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
