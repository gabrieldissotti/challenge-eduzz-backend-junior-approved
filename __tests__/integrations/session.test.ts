import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Session Controller', () => {
  describe('store', () => {
    it('should be able to authenticate', async () => {
      const { email } = await factory.create('User', {
        password: '123456',
      })

      const response = await request(app)
        .post('/sessions')
        .send({
          email,
          password: '123456',
        });

      expect(response.body).toHaveProperty('token')
    });

    it('should not be able to authenticate when doesn\'t email and password', async () => {
      const response = await request(app)
        .post('/sessions')
        .send();

      expect(response.status).toBe(400)
    });
  });
})
