import request from 'supertest'

import app from '../../app'

import { getMysqlDb } from "../../config/mysql";

import listedProductOne from '../../mocks/listed_product_1.json'

// TODO: can I abstract this common setup between the tests into another file?
 // start transaction automatically sets autocommit to false
beforeEach(async () => await getMysqlDb().query('START TRANSACTION'))
afterEach(async () => await getMysqlDb().query('ROLLBACK'))
afterAll(async () => await getMysqlDb().close());

describe('Listed product routes', () => {
  test('Get size and min price grouped by name and colorway', async done => {
    const sizeMinPriceGroupByName = await request(app).get('/api/listed_product?name=Kobe 14 Black')
    const expected = [{ size: 12, minPrice: 600 }, { size: 10, minPrice: 400 }]

    expect(sizeMinPriceGroupByName.body).toEqual(expected)

    done()
  })

  test('Get none by name only', async done => {
    const emptySet = await request(app).get('/api/listed_product?name=Kobe 14')
    expect(emptySet.body).toHaveLength(0)

    done()
  })

  // NOTE: another thing to test possibly is the properties of the object returned
  test('Get listed products by size', async done => {
    const size12Listed = await request(app).get('/api/listed_product?size=12').then(r => r.body)
    expect(size12Listed).toHaveLength(5)

    done()
  })

  test('Get all listed products', async done => {
    const allListedProducts = await request(app).get('/api/listed_product').then(r => r.body)
    expect(allListedProducts).toHaveLength(5)

    done()
  })

  test('Get gallery sneakers', async done => {
    const gallerySneakers = await request(app).get('/api/listed_product/gallery').then(r => r.body)
    expect(gallerySneakers).toHaveLength(4)

    done()
  })

  test('Create a listed product', async done => {
    const response = await request(app).post('/api/listed_product').send(listedProductOne).then(r => r.body)    
    expect(response.affectedRows).toBe(1)

    done()
  })
})
