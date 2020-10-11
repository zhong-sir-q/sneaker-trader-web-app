import faker from 'faker';

import { Sneaker } from '../../../../shared';

const fakeSneaker = (): Sneaker => ({
  id: faker.random.number(),
  RRP: faker.random.number(),
  size: faker.random.number(),
  name: faker.commerce.productName(),
  brand: faker.random.word(),
  colorway: faker.internet.color(),
  imageUrls: faker.internet.url(),
});

export default fakeSneaker
