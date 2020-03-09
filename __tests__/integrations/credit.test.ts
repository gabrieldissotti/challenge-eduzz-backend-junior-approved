import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Credit Controller', () => {
  describe('index', () => {
    it('shouldn\'t be able to credit money without authentication', async () => {
      const response = await request(app)
        .post('/credits');

      expect(response.status).toBe(401)
    });

    it('should be able to credit money when user is authenticated', async () => {
      const data = {
        email: 'devinvestcoin3@gmail.com',
        password: '123456'
      };

      await factory.create('User', data)

      const authResponse = await request(app)
        .post('/sessions')
        .send(data);

      expect(authResponse.status).toBe(200)

      const response = await request(app)
        .post('/credits')
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .send({
          amount: 25.50
        });

      expect(response.status).toBe(200)
    });
  });
})
