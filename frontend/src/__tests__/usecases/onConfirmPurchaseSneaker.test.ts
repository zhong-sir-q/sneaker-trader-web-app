import onConfirmPurchaseSneaker from 'usecases/onConfirmPurchaseSneaker';
import fakeAfterPurchaseMailPayload from '__mocks__/data/fakeAfterPurchaseMailPayload';
import fakeTransaction from '__mocks__/data/fakeTransaction';
import fakeDecreaseWalletPayload from '__mocks__/data/fakeDecreaseWalletPayload';

import {
  MockWalletControllerInstance,
  MockListedSneakerControllerInstance,
  MockTransactionControllerInstance,
  MockMailControllerInstance,
} from '__mocks__/controllers';

test('Respective functions are called on confirm purchase sneaker', async (done) => {
  await onConfirmPurchaseSneaker(
    MockListedSneakerControllerInstance,
    MockTransactionControllerInstance,
    MockWalletControllerInstance,
    MockMailControllerInstance
  )(fakeAfterPurchaseMailPayload(), fakeTransaction(), fakeDecreaseWalletPayload());

  expect(MockMailControllerInstance.mailOnConfirmPurchase).toBeCalledTimes(1);
  expect(MockListedSneakerControllerInstance.handlePurchase).toBeCalledTimes(1);
  expect(MockTransactionControllerInstance.create).toBeCalledTimes(1);
  expect(MockWalletControllerInstance.decreaseBalance).toBeCalledTimes(1);

  done();
});
