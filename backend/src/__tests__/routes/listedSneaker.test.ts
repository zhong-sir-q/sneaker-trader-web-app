import request from 'supertest';

import app from '../../app';

import fakeUser from '../../__mocks__/fakeUser';
import clearTable from '../../__mocks__/teardown/clearTable';

import fakeSneaker from '../../__mocks__/fakeSneaker';

import { PRODUCTS, LISTED_PRODUCTS, USERS } from '../../config/tables';
import initListedSneakerTable from '../../__mocks__/setup/initListedSneakerTable';
import fakeListedSneaker from '../../__mocks__/fakeListedSneaker';
import mysqlPoolConnection from '../../config/mysql';
import { formatGetRowsQuery, formatUpdateRowsQuery } from '../../utils/formatDbQuery';

import faker from 'faker';

beforeAll(async () => {
  const poolConn = await mysqlPoolConnection();
  // disable only full group by
  await poolConn.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY', ''))`);
  await initListedSneakerTable();
});

afterAll(async () => {
  await clearTable(LISTED_PRODUCTS);
  await clearTable(PRODUCTS);
  await clearTable(USERS);
});

describe('Listed product routes', () => {
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
    const gallerySneakers = await request(app)
      .get(`/api/listedSneaker/gallery/${-1}`)
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

  test('All sneakers should have the "listed" status', async (done) => {
    // randomly update the statuses of half the sneakers to either pending or sold
    const getQuery = formatGetRowsQuery(LISTED_PRODUCTS);
    const poolConnOne = await mysqlPoolConnection();
    const initListedSneakers = await poolConnOne.query(getQuery);

    const half = Math.floor(initListedSneakers.length * 0.5);

    for (let i = 0; i < half; i++) {
      const idx = faker.random.number(initListedSneakers.length - 1);
      const sneakerToUpdate = initListedSneakers[idx];

      const id = sneakerToUpdate.id;
      const randStatus = ['pending', 'sold'][faker.random.number(1)];

      const poolConn = await mysqlPoolConnection();

      const updateQuery = formatUpdateRowsQuery(LISTED_PRODUCTS, { prodStatus: randStatus }, `id = ${id}`);
      await poolConn.query(updateQuery);
    }

    // then by getAllListedSneakers should return only sneakers with prodStatus = 'listed'
    const allListedSneakers = await request(app)
      .get('/api/listedSneaker')
      .then((r) => r.body);

    for (const listed of allListedSneakers) expect(listed.prodStatus).toBe('listed');

    done();
  });

  test('Update the listed sneaker', async (done) => {
    // sneakers should be populated from above
    const allListedSneakers = await request(app)
      .get('/api/listedSneaker')
      .then((r) => r.body);
    // get the first listed sneaker
    const firstListedSneaker = allListedSneakers[0];

    const updateFirstListedSneakerPayload = fakeListedSneaker(firstListedSneaker.userId, firstListedSneaker.productId);

    const updateRes = await request(app)
      .put(`/api/listedSneaker/${firstListedSneaker.id}`)
      .send(updateFirstListedSneakerPayload);

    expect(updateRes.status).toBe(200);

    const getFirstListedSneaker = await request(app)
      .get(`/api/listedSneaker/${firstListedSneaker.id}`)
      .then((r) => r.body);

    expect(getFirstListedSneaker.askingPrice).toBe(updateFirstListedSneakerPayload.askingPrice);
    expect(getFirstListedSneaker.originalPurchasePrice).toBe(updateFirstListedSneakerPayload.originalPurchasePrice);
    expect(getFirstListedSneaker.currencyCode).toBe(updateFirstListedSneakerPayload.currencyCode);
    expect(getFirstListedSneaker.sizeSystem).toBe(updateFirstListedSneakerPayload.sizeSystem);

    done();
  });
});
