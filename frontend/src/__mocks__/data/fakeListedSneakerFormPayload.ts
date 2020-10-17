import faker from 'faker';

import { ListedSneakerFormPayload } from '../../../../shared';

const fakeListedSneakerFormPayload = (uploadedUrls: string[]): ListedSneakerFormPayload => ({
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
  mainDisplayImage: uploadedUrls[0],
});

export default fakeListedSneakerFormPayload;
