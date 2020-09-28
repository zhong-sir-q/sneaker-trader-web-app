import { AppUser } from '../../../shared';
import { Auth } from 'aws-amplify';
import UserControllerInstance from 'api/controllers/UserController';
import WalletControllerInstance from 'api/controllers/WalletController';

const onSignup = async (user: Omit<AppUser, 'profilePicUrl'>, password: string) => {
  const isDuplicateUsername = await UserControllerInstance.isDuplicateUsername(user.username);

  if (!isDuplicateUsername) {
    await Auth.signUp({ username: user.email, password }).then((r) => r.user);
    const userId = await UserControllerInstance.create(user);
    await WalletControllerInstance.create(userId)
  }
};

export default onSignup;
