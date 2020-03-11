import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Volume Controller', () => {
  describe('index', () => {
    it('shouldn\'t be able to show volume without authentication', async () => {
      const response = await request(app)
        .get('/volumes');

      expect(response.status).toBe(401)
    });

    it('should be able to show volume when user is authenticated', async () => {
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
        .get('/volumes')
        .set('Authorization', `Bearer ${authResponse.body.token}`);

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('buy')
      expect(response.body).toHaveProperty('sell')
    });
  });
})
