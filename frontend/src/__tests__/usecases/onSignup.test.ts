import Amplify from 'aws-amplify';
import onSignup from 'usecases/onSignup';
import fakeUser from '__mocks__/data/fakeUser';
import { MockUserControllerInstance, MockWalletControllerInstance } from '__mocks__/controllers';

jest.mock('aws-amplify', () => ({
  Auth: {
    signUp: jest.fn().mockResolvedValue({ user: null }),
  },
}));

jest.mock('api/controllers/UserController');
jest.mock('api/controllers/WalletController');

describe('On sign up user', () => {
  test('Create the user in db and amplify and create the wallet', async (done) => {
    await onSignup(MockUserControllerInstance, MockWalletControllerInstance)(fakeUser(), '123456');

    expect(MockUserControllerInstance.create).toBeCalledTimes(1);
    expect(MockWalletControllerInstance.create).toBeCalledTimes(1);
    expect(Amplify.Auth.signUp).toBeCalledTimes(1);

    done();
  });
});
