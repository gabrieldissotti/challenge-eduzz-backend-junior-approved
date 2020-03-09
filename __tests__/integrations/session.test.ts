import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Session Controller', () => {
  describe('store', () => {
    it('should be able to authenticate', async () => {
      const user = {
        email: 'devinvestcoin2@gmail.com',
        password: '123456',
      };

      await factory.create('User', user)

      const response = await request(app)
        .post('/sessions')
        .send(user);

      expect(response.body).toHaveProperty('token')
    });
  });
})
