import {
  formatUpdateColumnsQuery,
  doubleQuotedValue,
  doubleQuotedValues,
  formatInsertColumnsQuery,
  formatSetQuery,
  formatColumns,
  formatGetRowsQuery,
} from '../../utils/formatDbQuery';

describe('Test format db queries dependent util functions', () => {
  test('Double quote single value', () => {
    expect(doubleQuotedValue('Jungle')).toBe('"Jungle"');
    expect(doubleQuotedValue('$2')).toBe('"$2"');
    expect(doubleQuotedValue('_2_1_')).toBe('"_2_1_"');
  });

  test('Double quote object values', () => {
    const listedProductOneValues = doubleQuotedValues({
      productId: 14,
      userId: 3,
      askingPrice: 420,
      quantity: 1,
      currencyCode: 'NZD',
      prodCondition: 'new',
      sizeSystem: 'US',
    });

    expect(listedProductOneValues).toEqual([14, 3, 420, 1, '"NZD"', '"new"', '"US"']);
  });

  test('Format object keys', () => {
    const formatedKeys = formatColumns({
      brand: 'Nike',
      colorway: 'Black',
      description: '',
      imageUrls:
        'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
      name: 'Kobe 14',
      price: 500,
      size: 12,
    });

    expect(formatedKeys).toBe('brand, colorway, description, imageUrls, name, price, size');
  });
});

describe('Format db queries', () => {
  test('Format set column-value query', () => {
    const mockObjOne = {
      wingspan: '7 feet',
      height: '6 feet 5',
      name: 'Lebron James',
      age: 23,
    };

    const setColumnValueQuery = formatSetQuery(mockObjOne);
    const expectedResult = 'wingspan="7 feet", height="6 feet 5", name="Lebron James", age=23';

    expect(setColumnValueQuery).toBe(expectedResult);
  });

  test('Format update columns query', () => {
    const listedProductOne = {
      productId: 14,
      userId: 3,
      askingPrice: 420,
      quantity: 1,
      currencyCode: 'NZD',
      prodCondition: 'new',
      sizeSystem: 'US',
    };

    const updateColumnsQuery = formatUpdateColumnsQuery('RandomTableName', listedProductOne, 'a = b');

    const expectedQuery =
      'UPDATE RandomTableName SET productId=14, userId=3, askingPrice=420, quantity=1, currencyCode="NZD", prodCondition="new", sizeSystem="US" WHERE a = b';

    expect(updateColumnsQuery).toBe(expectedQuery);
  });

  test('Format insert columns query', () => {
    const mockMovie = {
      genre: 'Animation',
      name: 'Star Wars',
      year: 2004,
    };

    const query = formatInsertColumnsQuery('Movies', mockMovie);
    const expectedQuery = 'INSERT INTO Movies (genre, name, year) VALUES ("Animation", "Star Wars", 2004)';

    expect(query).toBe(expectedQuery);
  });

  test('Format get columns query without condition', () => {
    const getQueryWithoutCondition = formatGetRowsQuery('NBAStats');
    expect(getQueryWithoutCondition).toBe('SELECT * FROM NBAStats');
  });

  test('Format get columns query with condition', () => {
    const getQueryWithCondition = formatGetRowsQuery('GameOfThrones', 'character = "Kalesi"');
    expect(getQueryWithCondition).toBe('SELECT * FROM GameOfThrones WHERE character = "Kalesi"');
  });
});
