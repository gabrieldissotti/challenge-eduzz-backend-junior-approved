/**
 * @swagger
 *
 *
 * /positions:
 *    get:
 *      tags:
 *        - Bitcoin (BTC)
 *      name: Currency quotes
 *      summary: list investments position
 *      security:
 *        - bearerAuth: []
 *      produces:
 *        - application/json
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          default: 1
 *        - in: query
 *          name: pagesize
 *          schema:
 *            type: integer
 *          default: 30
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  count:
 *                    type: integer
 *                  rows:
 *                    type: array
 *                    items:
 *                      $ref: '#/definitions/Position'
 *
 *        400:
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 'Validation fails'
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
