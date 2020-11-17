import fakeUser from '__mocks__/data/fakeUser';
import { MockUserControllerInstance, MockRegistrationControllerInstance } from '__mocks__/controllers';

import onFederatedSignin from 'usecases/onFederatedSignin';

import Amplify from 'aws-amplify';
import faker from 'faker';

jest.mock('aws-amplify', () => ({
  Auth: {
    federatedSignIn: jest.fn().mockResolvedValue('default'),
  },
}));

afterEach(() => jest.clearAllMocks());

describe('User is signing in with a social provider', () => {
  const mockUser = fakeUser();

  test('Reject user if uses the same email address but different social provider', async (done) => {
    mockUser.signinMethod = 'google';

    const spyOnGetByEmail = jest.spyOn(MockUserControllerInstance, 'getByEmail').mockResolvedValue(mockUser);

    try {
      expect(
        await onFederatedSignin(MockUserControllerInstance, MockRegistrationControllerInstance)(
          'facebook',
          faker.lorem.word(),
          faker.random.number(),
          {
            email: mockUser.email,
            name: mockUser.username,
          }
        )
      ).toThrowError();
    } catch {}

    expect(spyOnGetByEmail).toBeCalledTimes(1);

    done();
  });

  test('Create user if not exists', async (done) => {
    mockUser.signinMethod = 'facebook';

    const spyOnGetByEmail = jest.spyOn(MockUserControllerInstance, 'getByEmail').mockResolvedValue(null);

    const spyOnRegisterUser = jest.spyOn(MockRegistrationControllerInstance, 'register');

    await onFederatedSignin(MockUserControllerInstance, MockRegistrationControllerInstance)(
      'facebook',
      faker.lorem.word(),
      faker.random.number(),
      {
        email: mockUser.email,
        name: mockUser.username,
      }
    );

    expect(spyOnGetByEmail).toBeCalledTimes(1);
    expect(spyOnRegisterUser).toBeCalledTimes(1);
    expect(Amplify.Auth.federatedSignIn).toBeCalledTimes(1);

    done();
  });

  test('Use social account name as db username, using the register method ', async (done) => {
    const userTwo = fakeUser();
    const userPayload = { email: userTwo.email, name: userTwo.username };
    const provider = 'facebook';

    const spyOnRegister = jest.spyOn(MockRegistrationControllerInstance, 'register');

    await onFederatedSignin(MockUserControllerInstance, MockRegistrationControllerInstance)(
      provider,
      '',
      -1,
      userPayload
    );

    expect(spyOnRegister).toBeCalledWith({ email: userTwo.email, username: userTwo.username, signinMethod: provider });

    done();
  });
});
