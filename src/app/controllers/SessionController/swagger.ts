/**
 * @swagger
 *
 * /sessions:
 *    post:
 *      tags:
 *        - Session
 *      name: Create Session
 *      summary: create a session (login)
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
 *              user:
 *                value:
 *                  email: 'gabrieldnrodrigues@gmail.com'
 *                  password: '123456'
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Session'
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
 *        401:
 *          description: forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'Password does not match'
 */
