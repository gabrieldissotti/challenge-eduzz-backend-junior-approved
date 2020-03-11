import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Buy Controller', () => {
  describe('store', () => {
    it('shouldn\'t be able to buy bitcoin without authentication', async () => {
      const response = await request(app)
        .post('/buys');

      expect(response.status).toBe(401)
    });

    it('should be able to buy bitcoin when user is authenticated and has balance', async () => {
      const { id, email } = await factory.create('User', {
        password: '123456'
      })

      await factory.create('Transaction', { user_id: id, amount: 99999999.99 })

      const authResponse = await request(app)
        .post('/sessions')
        .send({
          email,
          password: '123456'
        });

      expect(authResponse.status).toBe(200)

      const response = await request(app)
        .post('/buys')
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .send({ amount_in_brl: 25 });

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
    });

    it('shouldn\'t be able to buy bitcoin when has insufficient balance', async () => {
      const user = await factory.create('User', {
        password: '123456'
      })

      const authResponse = await request(app)
        .post('/sessions')
        .send({
          email: user.email,
          password: '123456'
        });

      expect(authResponse.status).toBe(200)

      const response = await request(app)
        .post('/buys')
        .send({
          amount_in_brl: 99999999
        })
        .set('Authorization', `Bearer ${authResponse.body.token}`);

      expect(response.status).toBe(401)
    });
  });
})
