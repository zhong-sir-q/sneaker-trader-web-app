import faker from 'faker';

import onVerifyAddress from 'usecases/address_verification/onVerifyAddress';
import { MockAddressControllerInstance } from '__mocks__/controllers';
import fakeUserAddress from '__mocks__/data/fakeUserAddress';

test('Handling verifying the address', async (done) => {
  await onVerifyAddress(MockAddressControllerInstance)(faker.random.number(), fakeUserAddress());
  expect(MockAddressControllerInstance.addUserAddress).toBeCalledTimes(1);
  expect(MockAddressControllerInstance.generateAndUpdateVerifcationCode).toBeCalledTimes(1);
  expect(MockAddressControllerInstance.onSuccessGenerateCode).toBeCalledTimes(1);

  done();
});
