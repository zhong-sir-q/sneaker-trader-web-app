import request from 'supertest';

import app from '../../app';

import fakeUser from '../../mocks/fakeUser';
import clearTable from '../../mocks/teardown/clearTable';
import { USERS, TRANSACTION, PRODUCTS, LISTED_PRODUCTS } from '../../config/tables';
import fakeSneaker from '../../mocks/fakeSneaker';
import fakeListedSneaker from '../../mocks/fakeListedSneaker';
import { endPool } from '../../config/mysql';

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
