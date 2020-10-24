import request from 'supertest';
import app from '../../app';

import faker from 'faker';
import fakeUser from '../../__mocks__/fakeUser';

import clearTable from '../../__mocks__/teardown/clearTable';
import { USERS } from '../../config/tables';

afterAll(() => clearTable(USERS));

describe('User routes', () => {
  test('Create a user in db', async (done) => {
    const res = await request(app).post('/api/user/').send(fakeUser());

    expect(res.status).toBe(200);

    done();
  });

  test('Error creating user with duplicate username or email', async (done) => {
    const mockUser = fakeUser();
    const successRes = await request(app).post('/api/user/').send(mockUser);

    expect(successRes.status).toBe(200)

    const tmpUsername = mockUser.username;
    mockUser.username = faker.lorem.words();

    const duplicateEmailRes = await request(app).post('/api/user/').send(mockUser);
    expect(duplicateEmailRes.status).toBe(500);

    mockUser.username = tmpUsername;
    mockUser.email = faker.internet.email();

    const duplicateUsernameRes = await request(app).post('/api/user/').send(mockUser);
    expect(duplicateUsernameRes.status).toBe(500);

    done()
  });

  test('Get null from a random email', async (done) => {
    const res = await request(app)
      .get('/api/user/hello@fasfasfdsa.com')
      .catch((err) => err);

    expect(res.body).toBe(null);

    done();
  });

  test('Update user username and dob', async (done) => {
    const mockUser = fakeUser();
    await request(app).post('/api/user/').send(mockUser);

    const res = await request(app).put('/api/user').send({
      email: mockUser.email,
      username: 'Vince Carter',
      dob: '11/12/1980',
    });

    expect(res.status).toBe(200);

    // validate the update
    const user = await request(app)
      .get(`/api/user/${mockUser.email}`)
      .then((r) => r.body)
      .catch((err) => err);

    expect(user.username).toBe('Vince Carter');
    expect(user.dob).toBe('11/12/1980');

    done();
  });
});
