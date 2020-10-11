import faker from 'faker';

import { ListingFormSneaker } from '../../../../shared';

const fakeListingFormSneaker = (): ListingFormSneaker => ({
  size: faker.random.number(),
  name: faker.random.word(),
  brand: faker.random.word(),
  colorway: faker.random.word(),
});

export default fakeListingFormSneaker
