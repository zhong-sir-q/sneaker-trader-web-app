import request from 'supertest';

import app from '../../app';

import { getMysqlDb } from '../../config/mysql';

import listedProductOne from '../../mocks/listed_product_1.json';

// TODO: can I abstract this common setup between the tests into another file?
// start transaction automatically sets autocommit to false
beforeEach(async () => await getMysqlDb().query('START TRANSACTION'));
afterEach(async () => await getMysqlDb().query('ROLLBACK'));
afterAll(async () => await getMysqlDb().close());

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

  test('Get none by name only', async (done) => {
    const emptySet = await request(app).get('/api/listedSneaker?name=Kobe 14');
    expect(emptySet.body).toHaveLength(0);

    done();
  });

  // NOTE: another thing to test possibly is the properties of the object returned
  test('Get listed products by size', async (done) => {
    const size12Listed = await request(app)
      .get('/api/listedSneaker?size=12')
      .then((r) => r.body);

    const desiredListedProduct = {
      brand: expect.any(String),
      colorway: expect.any(String),
      name: expect.any(String),
      size: 12,
    };

    expect(size12Listed).toBeInstanceOf(Array);

    if (size12Listed.length > 0) expect(size12Listed[0]).toMatchObject(desiredListedProduct);

    done();
  });

  test('Get all listed products', async (done) => {
    const allListedProducts = await request(app)
      .get('/api/listedSneaker')
      .then((r) => r.body);

    const desiredListedProducts = {
      brand: expect.any(String),
      colorway: expect.any(String),
      name: expect.any(String),
      size: expect.any(Number),
    };

    expect(allListedProducts).toBeInstanceOf(Array);

    if (allListedProducts.length > 0) expect(allListedProducts[0]).toMatchObject(desiredListedProducts);

    done();
  });

  test('Get gallery sneakers', async (done) => {
    const gallerySneakers = await request(app)
      .get('/api/listedSneaker/gallery')
      .then((r) => r.body);

    const desiredGallerySneakers = {
      brand: expect.any(String),
      colorway: expect.any(String),
      name: expect.any(String),
      imageUrls: expect.any(String),
      price: expect.any(Number),
      size: expect.any(Number),
    };

    expect(gallerySneakers).toBeInstanceOf(Array);

    if (gallerySneakers.length > 0) expect(gallerySneakers[0]).toMatchObject(desiredGallerySneakers);

    done();
  });

  test('Create a listed product', async (done) => {
    const response = await request(app)
      .post('/api/listedSneaker')
      .send(listedProductOne)

    expect(response.status).toBe(200);

    done();
  });
});
