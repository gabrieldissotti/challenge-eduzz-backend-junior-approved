import { Router } from 'express';

import TestController from './app/controllers/TestController';

const routes = Router();

routes.get('/', (req, res) => res.redirect('/documentation'));

routes.get('/tests', TestController.index);

export default routes;
