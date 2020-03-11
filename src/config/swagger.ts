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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      }
    }
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '..', 'app/models/*.(ts|js)'),
    path.resolve(__dirname, '..', 'app/controllers/*.(ts|js)'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
