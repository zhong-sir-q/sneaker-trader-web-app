import faker from 'faker';

import { GallerySneaker, SneakerCondition } from '../../../../shared';

const fakeGallerySneaker = (): GallerySneaker => ({
  userId: faker.random.number(),
  productId: faker.random.number(),
  askingPrice: faker.random.number(),
  quantity: 1,
  sizeSystem: faker.lorem.word(),
  currencyCode: faker.lorem.word(),
  conditionRating: faker.random.number({ min: 1, max: 10 }),
  prodCondition: ['new', 'used', 'dead stock'][faker.random.number(2)] as SneakerCondition,
  imageUrls: faker.internet.url(),
  description: faker.lorem.lines(),
  serialNumber: faker.lorem.words(),
  originalPurchasePrice: faker.random.number(),
  mainDisplayImage: faker.internet.url(),
  prodStatus: 'listed',
  size: faker.random.number(),
  brand: faker.commerce.product(),
  name: faker.commerce.productName(),
  colorway: faker.internet.color(),
  minPrice: faker.random.number(),
});

export default fakeGallerySneaker;
