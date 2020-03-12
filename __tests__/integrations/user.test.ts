import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('User Controller', () => {
  describe('store', () => {
    it('should able to register user', async () => {
      const user = await factory.attrs('User')

      const response = await request(app)
        .post('/users')
        .send(user);

      expect(response.status).toBe(200)
    });

    it('shouldn\'t able to register user with already existing email', async () => {
      const { email } = await factory.create('User', {
        password: '123456',
      })

      const response = await request(app)
        .post('/users')
        .send({
          email,
          password: '123456'
        });

      expect(response.status).toBe(400)
    });
  });
})
