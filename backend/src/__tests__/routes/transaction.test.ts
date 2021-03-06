import request from 'supertest';

import app from '../../app';

import fakeUser from '../../__mocks__/fakeUser';
import clearTable from '../../__mocks__/teardown/clearTable';
import { USERS, TRANSACTION, PRODUCTS, LISTED_PRODUCTS } from '../../config/tables';
import fakeSneaker from '../../__mocks__/fakeSneaker';
import fakeListedSneaker from '../../__mocks__/fakeListedSneaker';
import mysqlPoolConnection, { endPool } from '../../config/mysql';

beforeAll(async () => {
  const poolConn = await mysqlPoolConnection()

  // disable only full group by
  await poolConn.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY', ''))`);
})

afterAll(async () => {
  await clearTable(TRANSACTION);
  await clearTable(LISTED_PRODUCTS);
  await clearTable(PRODUCTS);
  await clearTable(USERS);
  endPool();
});

describe('Transaction route', () => {
  test('Create a transaction', async (done) => {
    const fakeBuyerId = await request(app)
      .post('/api/user')
      .send(fakeUser())
      .then((r) => r.body);

    const fakeSellerId = await request(app)
      .post('/api/user')
      .send(fakeUser())
      .then((r) => r.body);

    const mockSneakerId = await request(app)
      .post('/api/sneaker')
      .send(fakeSneaker())
      .then((r) => r.body);

    const mockListedProductId = await request(app)
      .post('/api/listedSneaker')
      .send(fakeListedSneaker(fakeSellerId, mockSneakerId))
      .then((r) => r.body);

    const mockTransaction = {
      buyerId: fakeBuyerId,
      sellerId: fakeSellerId,
      amount: 500,
      processingFee: 50,
      listedProductId: mockListedProductId,
    };

    const res = await request(app).post('/api/transaction').send(mockTransaction);
    expect(res.status).toBe(200);

    done();
  });
});
