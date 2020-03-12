import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import User from '../../src/app/models/User';

describe('Balance Controller', () => {
  describe('index', () => {
    it('shouldn\'t be able to request balance without token', async () => {
      const response = await request(app)
        .get('/balances');

      expect(response.status).toBe(401)
    });

    it('should be able to request balance when user is authenticated', async () => {
      const { email } = await factory.create('User', {
        password: '123456'
      })

      const authResponse = await request(app)
        .post('/sessions')
        .send({
          email,
          password: '123456'
        });

      expect(authResponse.status).toBe(200)

      const response = await request(app)
        .get('/balances')
        .set('Authorization', `Bearer ${authResponse.body.token}`);

      expect(response.status).toBe(200)
    });
  });
})
