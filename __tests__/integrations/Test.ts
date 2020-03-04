import request from 'supertest';

import app from '../../src/app';

describe('Test Controller', () => {
  describe('index', () => {
    it('When test is requested, the response status should be 200', done => {
      request(app)
        .get('/tests')
        .expect(200)
        .end(err => {
          if (err) throw err;

          done();
        });
    });
  });
})
