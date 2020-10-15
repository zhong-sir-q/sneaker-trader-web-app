import { concatPaths } from 'utils/formatApiEndpoint';
import sneakerInfoFromPath from 'utils/sneakerInfoFromPath';

import faker from 'faker';

describe('Utility functions', () => {
  test('Concat paths', () => {
    expect(concatPaths('/', 'hello')).toBe('/hello');
    expect(concatPaths('owl')).toBe('/owl');
    expect(concatPaths('')).toBe('/');
  });

  test('Sneaker info from path', () => {
    // No size in path error
    try {
      const mockPath = '/abc/market.k/lebron-james-sk';
      expect(sneakerInfoFromPath(mockPath)).toThrowError();
    } catch {}

    const mockPath = '/abc/market.k/pfafds/afa/lebron-james-sk/12';

    // max of i is 4 because there are 4 paths before the sneaker name colorway
    for (let i = 0; i < 5; i++) {
      const path = mockPath.split('/').slice(i).join('/');

      const info = sneakerInfoFromPath(path);

      const desiredObj = {
        nameColorway: expect.any(String),
        size: expect.any(Number),
      };

      expect(info).toMatchObject(desiredObj);
      expect(info.nameColorway).toBe('lebron james sk');
      expect(info.size).toBe(12);
    }
  });
});
