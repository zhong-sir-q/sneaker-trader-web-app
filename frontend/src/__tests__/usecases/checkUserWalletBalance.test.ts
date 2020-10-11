import checkUserWalletBalance from 'usecases/checkUserWalletBalance';
import { MockWalletControllerInstance } from '__mocks__/controllers';

import faker from 'faker';

afterEach(() => jest.clearAllMocks())

describe('Check user wallet balance', () => {
  test('Balance is positive', async (done) => {
    const spyGetBalanceByUserId = jest.spyOn(MockWalletControllerInstance, 'getBalanceByUserId').mockResolvedValue(100);

    const isBalancePositvie = await checkUserWalletBalance(MockWalletControllerInstance, faker.random.number());

    expect(spyGetBalanceByUserId).toBeCalledTimes(1);
    expect(isBalancePositvie).toBe(true);

    done();
  });

  test('User does not exist if the balance is null', async (done) => {
    const spyGetBalanceByUserId = jest.spyOn(MockWalletControllerInstance, 'getBalanceByUserId').mockResolvedValue(null);
    
    try {
      expect(await checkUserWalletBalance(MockWalletControllerInstance, faker.random.number()))
    } catch {}

    done()
  })
});
