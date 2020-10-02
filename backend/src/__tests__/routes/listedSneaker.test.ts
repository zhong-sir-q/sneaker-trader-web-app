import request from 'supertest';

import app from '../../app';

import fakeUser from '../../mocks/fakeUser';
import clearTable from '../../mocks/teardown/clearTable';

import fakeSneaker from '../../mocks/fakeSneaker';

import { PRODUCTS, LISTED_PRODUCTS, USERS } from '../../config/tables';
import initListedSneakerTable from '../../mocks/setup/initListedSneakerTable';
import fakeListedSneaker from '../../mocks/fakeListedSneaker';

beforeAll(() => initListedSneakerTable());

afterAll(async () => {
  await clearTable(LISTED_PRODUCTS);
  await clearTable(PRODUCTS);
  await clearTable(USERS);
});

describe('Listed product routes', () => {
  test('Get size and min price grouped by name and colorway', async (done) => {
    const sizeMinPriceGroupByName = await request(app)
      .get('/api/listedSneaker?name=Kobe 14 Black')
      .then((r) => r.body);

    expect(sizeMinPriceGroupByName).toBeInstanceOf(Array);

    if (sizeMinPriceGroupByName.length > 0)
      expect(sizeMinPriceGroupByName[0]).toMatchObject({ size: expect.any(Number), minPrice: expect.any(Number) });

    done();
  });

  test('Get all listed sneakers', async (done) => {
    const allSneakers = await request(app)
      .get('/api/listedSneaker')
      .then((r) => r.body);

    const desiredListedProduct = {
      brand: expect.any(String),
      colorway: expect.any(String),
      name: expect.any(String),
      size: expect.any(Number),
    };

    expect(allSneakers).toBeInstanceOf(Array);

    if (allSneakers.length > 0) expect(allSneakers[0]).toMatchObject(desiredListedProduct);

    done();
  });

  test('Get gallery sneakers', async (done) => {
    const dummyUserId = await request(app)
      .post('/api/user/')
      .send(fakeUser())
      .then((r) => r.body);

    const gallerySneakers = await request(app)
      .get(`/api/listedSneaker/gallery/${dummyUserId}`)
      .then((r) => r.body);

    const desiredGallerySneakers = {
      brand: expect.any(String),
      colorway: expect.any(String),
      name: expect.any(String),
      imageUrls: expect.any(String),
      minPrice: expect.any(Number),
      size: expect.any(Number),
    };

    expect(gallerySneakers).toBeInstanceOf(Array);

    if (gallerySneakers.length > 0) expect(gallerySneakers[0]).toMatchObject(desiredGallerySneakers);

    done();
  });

  test('Create a listed sneaker', async (done) => {
    const mockSellerId = await request(app)
      .post('/api/user/')
      .send(fakeUser())
      .then((r) => r.body);

    const mockSneakerId = await request(app)
      .post('/api/sneaker')
      .send(fakeSneaker())
      .then((r) => r.body);

    const response = await request(app).post('/api/listedSneaker').send(fakeListedSneaker(mockSellerId, mockSneakerId));

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('number');

    done();
  });
});
