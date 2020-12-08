import request from 'supertest';
import faker from 'faker';

import app from '../../app';

import { PRODUCTS } from '../../config/tables';
import clearTable from '../../__mocks__/teardown/clearTable';

import fakeSneaker from '../../__mocks__/fakeSneaker';

afterAll(() => clearTable(PRODUCTS));

describe('Sneaker route', () => {
  test('Succesfully create a sneaker', async (done) => {
    const res = await request(app).post('/api/sneaker').send(fakeSneaker());

    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('number');
    done();
  });

  test('Error creating a sneaker already exists', async (done) => {
    const mockSneaker = fakeSneaker()
    await request(app).post('/api/sneaker').send(mockSneaker);

    const failedRes = await request(app).post('/api/sneaker').send(mockSneaker);
    expect(failedRes.status).toBe(500)
    done()
  })
});
