import { Router } from 'express';

import TestController from './app/controllers/TestController';

const routes = Router();

routes.get('/tests', TestController.index);

export default routes;
