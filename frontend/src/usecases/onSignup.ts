import { AppUser } from '../../../shared';
import { Auth } from 'aws-amplify';
import { UserController } from 'api/controllers/UserController';
import { WalletController } from 'api/controllers/WalletController';

const onSignup = (UserControllerInstance: UserController, WalletControllerInstance: WalletController) => async (
  user: Omit<AppUser, 'profilePicUrl'>,
  password: string
) => {
  const userId = await UserControllerInstance.create(user);
  await WalletControllerInstance.create(userId);
  await Auth.signUp({ username: user.email, password }).then((r) => r.user);
};

export default onSignup;
