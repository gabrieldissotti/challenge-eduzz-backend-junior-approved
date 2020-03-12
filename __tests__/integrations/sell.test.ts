import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Sell Controller', () => {
  describe('store', () => {
    it('shouldn\'t be able to sell bitcoin without authentication', async () => {
      const response = await request(app)
        .post('/sells');

      expect(response.status).toBe(401)
    });

    it('should be able to sell bitcoin when user is authenticated and has balance', async () => {
      const { id, email } = await factory.create('User', {
        password: '123456'
      })

      await factory.create('TransactionBTC', { user_id: id, amount: 0.001 })

      const authResponse = await request(app)
        .post('/sessions')
        .send({
          email,
          password: '123456'
        });

      expect(authResponse.status).toBe(200)

      const response = await request(app)
        .post('/sells')
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .send({ amount_in_btc: 0.001 });

      expect(response.status).toBe(200)
    });

    it('shouldn\'t be able to sell bitcoin when has insufficient balance', async () => {
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
        .post('/sells')
        .send({
          amount_in_btc: 9999
        })
        .set('Authorization', `Bearer ${authResponse.body.token}`);

      expect(response.status).toBe(400)
    });
  });
})
