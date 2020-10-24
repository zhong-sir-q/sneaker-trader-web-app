import faker from 'faker';

import { SneakerCondition,  GetListedSneaker } from '../../../../shared';

const conditions: SneakerCondition[] = ['new', 'used', 'dead stock'];

const fakeGetListedSneaker = (userId: number, productId: number): GetListedSneaker => ({
  id: faker.random.number(),
  userId,
  productId,
  askingPrice: faker.random.number(),
  quantity: 1,
  sizeSystem: faker.lorem.word(),
  currencyCode: faker.lorem.word(),
  conditionRating: faker.random.number({ min: 1, max: 10 }),
  prodCondition: conditions[faker.random.number(2)],
  imageUrls: faker.internet.url(),
  description: faker.lorem.lines(),
  serialNumber: faker.lorem.words(),
  originalPurchasePrice: faker.random.number(),
  mainDisplayImage: faker.internet.url(),
  prodStatus: 'listed',
  size: faker.random.number(),
  brand: faker.commerce.product(),
  name: faker.commerce.productName(),
  colorway: faker.internet.color()
});

export default fakeGetListedSneaker;
