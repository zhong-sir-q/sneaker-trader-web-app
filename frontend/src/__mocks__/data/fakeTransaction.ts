import faker from 'faker';
import { CreateTransactionPayload } from '../../../../shared';

const fakeTransaction = (): CreateTransactionPayload => ({
  buyerId: faker.random.number(),
  sellerId: faker.random.number(),
  amount: faker.random.number(),
  processingFee: faker.random.number(),
  listedProductId: faker.random.number(),
});

export default fakeTransaction;
