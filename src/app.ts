import './bootstrap';

import server from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';

import './database';
import routes from './routes';
import swaggerSpec from './config/swagger';
import logger from './logger';

import Queue from './lib/Queue';
import UpdateCurrency from './app/jobs/UpdateCurrency';

class App {
  public server: server.Application;

  public constructor () {
    this.server = server();

    this.middlewares();
    this.routes();
    this.jobs();
    this.logs()
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

  public logs (): void {
    if (process.env.NODE_ENV !== 'test') {
      this.server.use(morgan('combined', { stream: logger.stream }));
    }
  }
}

export default new App().server;
