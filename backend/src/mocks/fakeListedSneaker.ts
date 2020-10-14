import faker from 'faker';
import { SneakerCondition, CreateListedSneakerPayload } from '../../../shared';
import fakeImgUrls from './fakeImgUrls';

const conditions: SneakerCondition[] = ['new', 'used', 'dead stock'];
const fakeListedSneaker = (userId: number, productId: number): CreateListedSneakerPayload => ({
  userId,
  productId,
  askingPrice: faker.random.number(),
  quantity: 1,
  sizeSystem: faker.lorem.word(),
  currencyCode: faker.lorem.word(),
  conditionRating: faker.random.number({ min: 1, max: 10 }),
  prodCondition: conditions[faker.random.number(2)],
  imageUrls: fakeImgUrls(),
  description: faker.lorem.lines(),
  serialNumber: faker.lorem.words(),
  originalPurchasePrice: faker.random.number(),
});

export default fakeListedSneaker;
