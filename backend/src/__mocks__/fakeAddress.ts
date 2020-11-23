import faker from 'faker';
import { Address, AddrVerificationStatus } from '../../../shared';

const fakeAddress = (): Address => ({
  street: faker.address.streetName(),
  city: faker.address.city(),
  region: faker.address.state(),
  zipcode: Number(faker.address.zipCode()),
  country: faker.address.country(),
  suburb: faker.address.county(),
  verificationStatus: ['not_verified', 'in_progress', 'verified'][faker.random.number(2)] as AddrVerificationStatus,
});

export default fakeAddress;
