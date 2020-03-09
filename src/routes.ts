import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CreditController from './app/controllers/CreditController';
import BalanceController from './app/controllers/BalanceController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.get('/', (req, res) => res.redirect('/documentation'));

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/credits', CreditController.store);

routes.get('/balances', BalanceController.index);

export default routes;
