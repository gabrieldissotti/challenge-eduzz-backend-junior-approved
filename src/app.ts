import 'dotenv/config';

import server from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import './database';
import routes from './routes';
import swaggerSpec from './config/swagger';

class App {
  public server: server.Application;

  public constructor () {
    this.server = server();

    this.middlewares();
    this.routes();
  }

  private middlewares (): void {
    this.server.use(server.json());
    this.server.use(cors());
    this.server.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private routes (): void {
    this.server.use(routes);
  }
}

export default new App().server;
