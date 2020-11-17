import { AppUser } from '../../../shared';
import { Auth } from 'aws-amplify';
import { UserRegistrationController } from 'api/controllers/UserRegistrationController';

const onSignup = (UserRegistrationControllerInstance: UserRegistrationController) => async (
  user: Omit<AppUser, 'profilePicUrl'>,
  password: string
) => {
  await UserRegistrationControllerInstance.register(user)
  await Auth.signUp({ username: user.email, password }).then((r) => r.user);
};

export default onSignup;
