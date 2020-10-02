import faker from 'faker';
import { SneakerCondition } from '../../../shared';
import fakeImgUrls from './fakeImgUrls';

const conditions: SneakerCondition[] = ['new', 'used', 'dead stock'];
const fakeListedSneaker = (userId: number, productId: number) => ({
  userId,
  productId,
  askingPrice: faker.random.number(),
  quantity: 1,
  sizeSystem: faker.lorem.word(),
  currencyCode: faker.lorem.word(),
  conditionRating: faker.random.number({ min: 1, max: 10 }),
  prodCondition: conditions[faker.random.number(2)],
  imageUrls: fakeImgUrls(),
});

export default fakeListedSneaker;
