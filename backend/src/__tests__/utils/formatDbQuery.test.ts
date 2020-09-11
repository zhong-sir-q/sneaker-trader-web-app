import productOne from '../../mocks/product_1.json'
import productTwo from '../../mocks/product_2.json'
import listedProductOne from '../../mocks/listed_product_1.json'

import { formatUpdateColumnsQuery, doubleQuotedValue, doubleQuotedValues, formatInsertColumnsQuery, formatSetQuery, formatColumns, formateGetColumnsQuery } from '../../utils/formatDbQuery'

describe('Test format db queries dependent util functions', () => {
  test('Double quote single value', () => {
    expect(doubleQuotedValue('Jungle')).toBe('"Jungle"')
    expect(doubleQuotedValue('$2')).toBe('"$2"')
    expect(doubleQuotedValue('_2_1_')).toBe('"_2_1_"')
  })

  test('Double quote object values', () => {
    const listedProductOneValues = doubleQuotedValues(listedProductOne)
    const productOneValues = doubleQuotedValues(productOne)

    expect(listedProductOneValues).toEqual([15, 3, 1000, 1, 0])

    const imgUrl = '"https://stockx.imgix.net/Air-Jordan-12-Retro-Black-University-Gold-Product.jpg?fit=fill&bg=FFFFFF&w=300&h=214&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1597154086"'
    const name = '"Air Jordan 12 Retro"'
    const brand = '"Air Jordan"'
    const colorway = '"Black and Yellow"'

    expect(productOneValues).toEqual([name, brand, 11, colorway, 120, imgUrl])
  })

  test('Format object keys', () => {
    const formatedKeys = formatColumns(productTwo)
    expect(formatedKeys).toBe('brand, colorway, description, imageUrls, name, price, size')
  })
})

describe('Format db queries', () => {
  test('Format set column-value query', () => {
    const mockObjOne = {
      wingspan: "7 feet",
      height: "6 feet 5",
      name: "Lebron James",
      age: 23
    }

    const setColumnValueQuery = formatSetQuery(mockObjOne)
    const expectedResult = 'wingspan="7 feet", height="6 feet 5", name="Lebron James", age=23'

    expect(setColumnValueQuery).toBe(expectedResult)
  })

  test('Format update columns query', () => {
    const updateColumnsQuery = formatUpdateColumnsQuery('RandomTableName', listedProductOne, 'a = b')

    const expectedQuery = 'UPDATE RandomTableName SET productId=15, userId=3, askingPrice=1000, quantity=1, sold=0 WHERE a = b'

    expect(updateColumnsQuery).toBe(expectedQuery)
  })

  test('Format insert columns query', () => {
    const mockMovie = {
      genre: 'Animation',
      name: 'Star Wars',
      year: 2004
    }

    const query = formatInsertColumnsQuery('Movies', mockMovie)
    const expectedQuery = 'INSERT INTO Movies (genre, name, year) VALUES ("Animation", "Star Wars", 2004)'

    expect(query).toBe(expectedQuery)
  })

  test('Format get columns query without condition', () => {
    const getQueryWithoutCondition = formateGetColumnsQuery('NBAStats')
    expect(getQueryWithoutCondition).toBe('SELECT * FROM NBAStats')
  })

  test('Format get columns query with condition', () => {
    const getQueryWithCondition = formateGetColumnsQuery('GameOfThrones', 'character = "Kalesi"')
    expect(getQueryWithCondition).toBe('SELECT * FROM GameOfThrones WHERE character = "Kalesi"')
  })
})
