import faker from 'faker';
import { DecreaseWalletPayload } from '../../../../shared';

const fakeDecreaseWalletPayload = (): DecreaseWalletPayload => ({
  userId: faker.random.number(),
  amount: faker.random.number(),
});

export default fakeDecreaseWalletPayload;
