import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerDefinition = {
  openapi: '3.0.2',
  info: {
    title: 'Eduzz Challenge - Backend Developer',
    version: '1.0.0',
    description: 'Documentation for Eduzz Challenge - Backend Developer',
    contact: {
      name: 'Gabriel Dissotti',
      url: 'https://github.com/gabrieldissotti',
      email: 'gabrieldnrodrigues@gmail.com',
    },
  },
  host: 'localhost:3333',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '..', 'app/models/*.ts'),
    path.resolve(__dirname, '..', 'app/controllers/*.ts'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
