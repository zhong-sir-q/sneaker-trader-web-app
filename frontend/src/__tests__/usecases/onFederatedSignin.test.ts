import fakeUser from '__mocks__/data/fakeUser';
import { MockUserControllerInstance } from '__mocks__/controllers'

import onFederatedSignin from 'usecases/onFederatedSignin';

import Amplify from 'aws-amplify';
import faker from 'faker';

jest.mock('aws-amplify', () => ({
  Auth: {
    federatedSignIn: jest.fn().mockResolvedValue('default'),
  },
}));

afterEach(() => jest.clearAllMocks());

describe('Check user when signing in with social provider', () => {
  const mockUser = fakeUser();

  test('Reject user if uses the same email address but different social provider', async (done) => {
    mockUser.signinMethod = 'google';

    const spyOnGetByEmail = jest.spyOn(MockUserControllerInstance, 'getByEmail').mockResolvedValue(mockUser);

    try {
      expect(
        await onFederatedSignin(MockUserControllerInstance)('facebook', faker.lorem.word(), faker.random.number(), {
          email: mockUser.email,
          name: mockUser.username,
        })
      ).toThrowError();
    } catch {}

    expect(spyOnGetByEmail).toBeCalledTimes(1);

    done();
  });

  test('Create user if not exists', async (done) => {
    mockUser.signinMethod = 'facebook';

    const spyOnGetByEmail = jest.spyOn(MockUserControllerInstance, 'getByEmail').mockResolvedValue(null);

    const spyCreateUser = jest.spyOn(MockUserControllerInstance, 'create');

    await onFederatedSignin(MockUserControllerInstance)('facebook', faker.lorem.word(), faker.random.number(), {
      email: mockUser.email,
      name: mockUser.username,
    });

    expect(spyOnGetByEmail).toBeCalledTimes(1);
    expect(spyCreateUser).toBeCalledTimes(1);
    expect(Amplify.Auth.federatedSignIn).toBeCalledTimes(1);

    done();
  });
});
