import { Request, Response } from 'express';
import * as Yup from 'yup';
import logger from '../../../logger';

import User from '../../models/User';

class UserController {
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required()
          .min(6),
      });

      await schema.validate(req.body).catch((err) => {
        return res.status(400).json({ error: err.message || 'Validation fails' });
      })

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) { return res.status(400).json({ error: 'User already exists!' }); }

      const { id, name, email } = await User.create(req.body);

      return res.json({ id, name, email });
    } catch (error) {
      console.log(error)
      logger.error(error.message)
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
