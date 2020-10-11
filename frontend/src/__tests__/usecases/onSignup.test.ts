import UserControllerInstance from 'api/controllers/UserController';
import WalletControllerInstance from 'api/controllers/WalletController';

import Amplify from 'aws-amplify';
import onSignup from 'usecases/onSignup';
import fakeUser from '__mocks__/data/fakeUser';

jest.mock('aws-amplify', () => ({
  Auth: {
    signUp: jest.fn().mockResolvedValue({ user: null }),
  },
}));

jest.mock('api/controllers/UserController');
jest.mock('api/controllers/WalletController');

describe('On sign up user', () => {
  test('Create the user in db and amplify and create the wallet', async (done) => {
    await onSignup(UserControllerInstance, WalletControllerInstance)(fakeUser(), '123456');

    expect(UserControllerInstance.create).toBeCalledTimes(1);
    expect(WalletControllerInstance.create).toBeCalledTimes(1);
    expect(Amplify.Auth.signUp).toBeCalledTimes(1);

    done();
  });
});
