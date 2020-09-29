import request from 'supertest';
import faker from 'faker'

import app from '../../app';

import mysqlPoolConnection, { poolQuery } from '../../config/mysql';

afterEach(async () => await poolQuery('ROLLBACK'))

afterAll(async () => {
  const poolConn = await mysqlPoolConnection()
  await poolConn.close()
});

describe('Product route', () => {
  test('Return null for getting a product with unknown shoe name and size', async (done) => {
    const randName = faker.name.firstName()
    const randNum = faker.random.number()

    const res = await request(app).get(`/api/product/${randName}/${randNum}`).then(r => r.body)

    expect(res).toBe(null)
    done()
  })
})
