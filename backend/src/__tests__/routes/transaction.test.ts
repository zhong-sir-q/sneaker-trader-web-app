import request from 'supertest';

import app from '../../app';

import { getMysqlDb } from '../../config/mysql';
import transactionOne from '../../mocks/transaction_1.json';

beforeEach(async () => await getMysqlDb().query('START TRANSACTION'));
afterEach(async () => await getMysqlDb().query('ROLLBACK'));
afterAll(async () => await getMysqlDb().close());

describe('Transaction route', () => {
  test('Create a transaction', async (done) => {
    const res = await request(app).post('/api/transaction').send(transactionOne);
    expect(res.status).toBe(200);

    done();
  });

  test('Fail to create transaction without seller id', async (done) => {
    const noSellerIdTransaction = {
      buyerId: 18,
      amount: 552,
      processingFee: 55.2,
      listedProductId: 22,
    };

    const res = await request(app).post('/api/transaction').send(noSellerIdTransaction)
    expect(res.status).toBe(500)

    done()
  });
});
