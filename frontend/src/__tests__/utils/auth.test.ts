import Amplify from 'aws-amplify';

import { getCurrentUser } from 'utils/auth';

import UserControllerInstance from 'api/controllers/UserController';

jest.mock('aws-amplify', () => ({
  Auth: {
    currentAuthenticatedUser: jest.fn().mockResolvedValue({
      attributes: { email: 'test@gmail.com' },
    }),
  },
}));

jest.mock('api/controllers/UserController', () => ({
  getByEmail: jest.fn().mockImplementation((email: string) => Promise.resolve(null)),
}));

afterEach(() => jest.clearAllMocks());

describe('Amplify Auth helper functions', () => {
  test('Get current user without cognito data', async (done) => {
    await getCurrentUser();

    expect(Amplify.Auth.currentAuthenticatedUser).toBeCalledTimes(1);
    expect(UserControllerInstance.getByEmail).toBeCalledTimes(1);
    done();
  });

  test('Get current user with cognito data', async (done) => {
    const fakeCognitoData = { email: 'random@hotmail.com' };
    await getCurrentUser(fakeCognitoData);

    expect(Amplify.Auth.currentAuthenticatedUser).toBeCalledTimes(0);
    expect(UserControllerInstance.getByEmail).toBeCalledTimes(1);

    done();
  });
});
