import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
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
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required(),
      });

      await schema.validate(req.body).catch((err) => {
        return res.status(400).json({ error: err.message || 'Validation fails' });
      })

      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) return res.status(401).json({ error: 'User not found' });

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({
          error: 'Password does not match'
        });
      }

      const { id, name } = user;

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new SessionController();
