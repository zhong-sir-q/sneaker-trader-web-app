import faker from 'faker';
import { MailAfterPurchasePayload } from '../../../../shared';

const fakeAfterPurchaseMailPayload = (): MailAfterPurchasePayload => ({
  sellerUserName: faker.internet.userName(),
  sellerEmail: faker.internet.email(),
  buyerUserName: faker.internet.userName(),
  buyerEmail: faker.internet.email(),
  productName: faker.lorem.words(),
});

export default fakeAfterPurchaseMailPayload;
