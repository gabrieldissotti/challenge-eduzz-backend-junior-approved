import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CreditController from './app/controllers/CreditController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.get('/', (req, res) => res.redirect('/documentation'));

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/credits', CreditController.store);

export default routes;
