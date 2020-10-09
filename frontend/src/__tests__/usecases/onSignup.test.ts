import UserControllerInstance from 'api/controllers/UserController';
import WalletControllerInstance from 'api/controllers/WalletController';

import Amplify from 'aws-amplify';
import onSignup from 'usecases/onSignup';
import fakeUser from '__mocks__/fakeUser';

jest.mock('aws-amplify', () => ({
  Auth: (data: { username: string; password: string }) => ({ user: data }),
}));

describe('On sign up user', () => {
  test('Create the user in db and amplify and create the wallet', async (done) => {
    const spyCreateUser = jest.spyOn(UserControllerInstance, 'create').mockImplementation(() => Promise.resolve(100));
    const spyCreateWallet = jest.spyOn(WalletControllerInstance, 'create');

    await onSignup(UserControllerInstance, WalletControllerInstance)(fakeUser(), '123456');

    expect(spyCreateUser).toBeCalledTimes(1);
    expect(spyCreateWallet).toBeCalledTimes(1);
    expect(Amplify.Auth).toBeCalledTimes(1);

    done();
  });
});
