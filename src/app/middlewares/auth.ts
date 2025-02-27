import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Request as ExpressRequest } from 'express';

import authConfig from '../../config/auth';

export interface Request extends ExpressRequest {
  userId: number;
}

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'token not provided' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
