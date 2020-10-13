import faker from 'faker';

import { Address, AddrVerificationStatus } from '../../../../shared';

const fakeUserAddress = (): Address => ({
  street: faker.address.streetName(),
  city: faker.address.city(),
  region: faker.address.county(),
  zipcode: Number(faker.address.zipCode()),
  country: faker.address.country(),
  verificationStatus: ['not_verified', 'in_progress', 'verified'][faker.random.number(2)] as AddrVerificationStatus,
});

export default fakeUserAddress
