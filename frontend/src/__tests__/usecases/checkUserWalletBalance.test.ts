import WalletControllerInstance from 'api/controllers/WalletController';
import checkUserWalletBalance from 'usecases/checkUserWalletBalance';

import reactRouterDom from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Check user wallet balance', () => {
  test('Calling getBalanceByUserId once', async (done) => {
    const history = reactRouterDom.useHistory();
    const spyGetBalanceByUserId = jest
      .spyOn(WalletControllerInstance, 'getBalanceByUserId')
      .mockImplementation((_userId: number) => Promise.resolve(100));

    await checkUserWalletBalance(WalletControllerInstance, 2, history);

    expect(spyGetBalanceByUserId).toBeCalledTimes(1);
    done();
  });
});
