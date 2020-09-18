import request from 'supertest';
import faker from 'faker'

import app from '../../app';

import { getMysqlDb } from '../../config/mysql';

beforeEach(async () => await getMysqlDb().query('START TRANSACTION'));
afterEach(async () => await getMysqlDb().query('ROLLBACK'));
afterAll(async () => await getMysqlDb().close());

describe('Product route', () => {
  test('Return null for getting a product with unknown shoe name and size', async (done) => {
    const randName = faker.name.firstName()
    const randNum = faker.random.number()

    const res = await request(app).get(`/api/product/${randName}/${randNum}`).then(r => r.body)

    expect(res).toBe(null)
    done()
  })
})
