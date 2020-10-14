import faker from 'faker';

import { ListedSneakerFormPayload } from '../../../../shared';

const fakeListedSneakerFormPayload = (): ListedSneakerFormPayload => ({
  askingPrice: faker.random.number(),
  quantity: faker.random.number(),
  sizeSystem: faker.random.word(),
  currencyCode: faker.finance.currencyCode(),
  prodStatus: 'pending',
  prodCondition: 'new',
  conditionRating: faker.random.number(),
  description: faker.random.word(),
  serialNumber: faker.random.word(),
  originalPurchasePrice: faker.random.number(),
});

export default fakeListedSneakerFormPayload;
