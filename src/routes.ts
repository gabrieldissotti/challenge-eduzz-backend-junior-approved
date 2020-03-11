import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CreditController from './app/controllers/CreditController';
import BalanceController from './app/controllers/BalanceController';
import QuoteController from './app/controllers/QuoteController';
import BuyController from './app/controllers/BuyController';
import PositionController from './app/controllers/PositionController';
import SellController from './app/controllers/SellController';
import BankStatementController from './app/controllers/BankStatementController';
import VolumeController from './app/controllers/VolumeController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.get('/', (req, res) => res.redirect('/documentation'));

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/credits', CreditController.store);

routes.get('/balances', BalanceController.index);

routes.get('/quotes', QuoteController.index);

routes.post('/buys', BuyController.store);

routes.get('/positions', PositionController.index);

routes.post('/sells', SellController.store);

routes.get('/bank-statements', BankStatementController.index);

routes.get('/volumes', VolumeController.index);

export default routes;
