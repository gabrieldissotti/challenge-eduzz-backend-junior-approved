import './bootstrap';

import server from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Youch from 'youch';
import swaggerUi from 'swagger-ui-express';
import { resolve } from 'path';
import 'express-async-errors';

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
    this.exceptionHandler();
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

  exceptionHandler (): any {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(err)
        logger.error(err.message)
      }

      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(err.status || 500).json(errors);
      }

      return res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    });
  }
}

export default new App().server;
