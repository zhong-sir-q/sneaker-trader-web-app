import request from 'supertest';
import app from '../../app';

import fakeUser from '../../mocks/fakeUser';
import mysqlPoolConnection, { poolQuery } from '../../config/mysql';

afterEach(async () => await poolQuery('ROLLBACK'))

afterAll(async () => {
  const poolConn = await mysqlPoolConnection()
  await poolConn.close()
});

describe('User routes', () => {
  test('Get a user by email', async (done) => {
    const res = await request(app)
      .get('/api/user/0alexzhong0@gmail.com')
      .catch((err) => err);

    expect(res.status).toBe(200);

    done();
  });

  test('Update user username and dob', async (done) => {
    const res = await request(app).put('/api/user').send({
      email: '0alexzhong0@gmail.com',
      username: 'Vince Carter',
      dob: '11/12/1980',
    });

    expect(res.status).toBe(200);

    // validate the update
    const user = await request(app).get('/api/user/0alexzhong0@gmail.com').then(r => r.body).catch(err => err)
    expect(user.username).toBe('Vince Carter')
    expect(user.email).toBe('0alexzhong0@gmail.com')
    expect(user.dob).toBe('11/12/1980')

    done();
  });

  test('Create a user in db', async (done) => {
    const res = await request(app).post('/api/user/').send(fakeUser)

    expect(res.status).toBe(200)

    done()
  })
});
