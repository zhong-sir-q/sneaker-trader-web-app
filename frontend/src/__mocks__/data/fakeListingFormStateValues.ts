import faker from 'faker';
import { SneakerListingFormStateType } from 'providers/SneakerListingFormProvider';
import { SneakerCondition } from '../../../../shared';

const fakeListingFormStateValues = (): SneakerListingFormStateType => ({
  name: faker.random.word(),
  brand: faker.random.word(),
  size: `${faker.random.number()}`,
  colorway: faker.random.word(),
  askingPrice: `${faker.random.number()}`,
  description: faker.lorem.paragraph(),
  originalPurchasePrice: `${faker.random.number()}`,
  sizeSystem: 'US',
  currencyCode: 'NZD',
  prodCondition: 'new' as SneakerCondition,
  conditionRating: 5,
});

export default fakeListingFormStateValues;
