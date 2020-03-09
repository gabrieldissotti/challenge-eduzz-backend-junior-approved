import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Quote Controller', () => {
  describe('index', () => {
    it('shouldn\'t be able to get bitcoin quotes without authentication', async () => {
      const response = await request(app)
        .post('/quotes');

      expect(response.status).toBe(401)
    });

    it('should be able to get bitcoin quote when user is authenticated', async () => {
      const data = {
        email: 'devinvestcoin4@gmail.com',
        password: '123456'
      };

      await factory.create('User', data)

      const authResponse = await request(app)
        .post('/sessions')
        .send(data);

      expect(authResponse.status).toBe(200)

      const response = await request(app)
        .get('/quotes')
        .set('Authorization', `Bearer ${authResponse.body.token}`);

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('bitcoin')
    });
  });
})
