import './bootstrap';

import server from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';

import './database';
import routes from './routes';
import swaggerSpec from './config/swagger';

import Queue from './lib/Queue';
import UpdateCurrency from './app/jobs/UpdateCurrency';

class App {
  public server: server.Application;

  public constructor () {
    this.server = server();

    this.middlewares();
    this.routes();
    this.jobs();
  }

  private middlewares (): void {
    this.server.use(server.json());
    this.server.use(cors());
    this.server.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.server.use(
      '/coverage',
      server.static(resolve(__dirname, '..', '__tests__', 'coverage', 'lcov-report'))
    );
  }

  private routes (): void {
    this.server.use(routes);
  }

  public jobs (): void {
    Queue.add(UpdateCurrency.key, {});
  }
}

export default new App().server;
