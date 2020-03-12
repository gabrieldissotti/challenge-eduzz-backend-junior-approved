/**
 * @swagger
 *
 * /users:
 *    post:
 *      tags:
 *        - Users
 *      name: Create User
 *      summary: create a user
 *      produces:
 *        - application/json
 *      consumes:
 *        - application/json
 *      description: "
 *
 *  - The password must be longer then 6 characters \n
 *  - The password, name and email are required \n
 *  - The email must be valid
 *
 * "
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            examples:
 *              user:
 *                value:
 *                  name: 'Gabriel Dissotti'
 *                  email: 'gabrieldnrodrigues@gmail.com'
 *                  password: '123456'
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/User'
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
