import request from 'supertest';

import fakeUser from '../../__mocks__/fakeUser';
import app from '../../app';

import fakeAddress from '../../__mocks__/fakeAddress';
import clearTable from '../../__mocks__/teardown/clearTable';

import { ADDRESS_VERIFICATION_CODE, USERS, ADDRESS } from '../../config/tables';

const mockUserOne = fakeUser();

let userId: number = -1;

afterAll(() => {
  clearTable(ADDRESS_VERIFICATION_CODE)
  clearTable(ADDRESS)
  clearTable(USERS)
});

describe('Address routes', () => {
  test('Get null address from a non-exist user', async (done) => {
    const addr = await request(app)
      .get(`/api/address/${userId}`)
      .then((r) => r.body);
    expect(addr).toBe(null);

    done();
  });

  test('Create the address for the user', async (done) => {
    // create the user
    userId = await request(app)
      .post('/api/user')
      .send(mockUserOne)
      .then((r) => r.body);

    // create the address

    const createAddrRes = await request(app).post(`/api/address/${userId}`).send(fakeAddress());
    expect(createAddrRes.status).toBe(200);

    done();
  });

  test('Generate verification code via POST', async (done) => {
    const res = await request(app).post(`/api/address/generateCode/${userId}`);
    const verifcationResText = await res.body;
    expect(res.status).toBe(200);

    // do not pass the code back to the client
    expect(isNaN(Number(verifcationResText))).toBeTruthy();
    done();
  });
});
