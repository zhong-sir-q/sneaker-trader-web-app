import { concatPaths } from 'utils/formatApiEndpoint';
import sneakerInfoFromPath from 'utils/sneakerInfoFromPath';
import {
  upperCaseFirstLetter,
  mapUpperCaseFirstLetter,
  range,
  getMainDisplayImgUrl,
  formatSneakerNameColorway,
  formatSneakerPathName,
} from 'utils/utils';

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

  test('Uppercase the first letter', () => {
    const w1 = 'sinon';
    expect(upperCaseFirstLetter(w1)).toBe('Sinon');

    const w2 = 'KaTe';
    expect(upperCaseFirstLetter(w2)).toBe('KaTe');

    expect(upperCaseFirstLetter('')).toBe('');
  });

  test('Uppercase the first letter of all words', () => {
    const s1 = 'this Is a Rand text';
    expect(mapUpperCaseFirstLetter(s1, ' ')).toBe('This Is A Rand Text');

    // the separator is ',', so it will only uppercase the first letter of the string
    expect(mapUpperCaseFirstLetter(s1, ',')).toBe('This Is a Rand text');
  });

  // exclusive of the end
  test('Create a list of numbers given a range', () => {
    const nums1 = range(1, 4, 1);
    expect(nums1).toEqual([1, 2, 3]);

    const nums2 = range(5, 1, -1);
    expect(nums2).toEqual([5, 4, 3, 2]);

    const nums3 = range(10, 2, 1);
    expect(nums3).toEqual([]);

    const nums4 = range(10, 20, 0);
    expect(nums4).toEqual([10]);
  });

  test('Get main display image url', () => {
    const u1 = 'abc, opq, xyz';

    expect(getMainDisplayImgUrl(u1)).toBe('abc');
    expect(getMainDisplayImgUrl(undefined)).toBe(undefined);
  });

  test('Format sneaker name colorway', () => {
    const n1 = 'Lebron';
    const c1 = 'White';

    expect(formatSneakerNameColorway(n1, c1)).toBe('Lebron White');
  });

  test('Format sneaker path name', () => {
    const n1 = 'Kobe';
    const c1 = 'Black';

    expect(formatSneakerPathName(n1, c1)).toBe('Kobe-Black');
  });
});
