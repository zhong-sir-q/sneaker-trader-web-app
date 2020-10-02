import request from 'supertest';
import faker from 'faker';

import app from '../../app';

import { PRODUCTS } from '../../config/tables';
import clearTable from '../../mocks/teardown/clearTable';

import fakeSneaker from '../../mocks/fakeSneaker';

afterAll(() => clearTable(PRODUCTS));

describe('Sneaker route', () => {
  test('Succesfully create a sneaker', async (done) => {
    const res = await request(app).post('/api/sneaker').send(fakeSneaker());

    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('number');
    done();
  });

  test('Return null for getting a product with unknown shoe name and size', async (done) => {
    const randName = faker.name.firstName();
    const randNum = faker.random.number();

    const res = await request(app)
      .get(`/api/sneaker/${randName}/${randNum}`)
      .then((r) => r.body);

    expect(res).toBe(null);
    done();
  });
});
