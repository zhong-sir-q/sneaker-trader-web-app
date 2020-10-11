import { UserController } from 'api/controllers/UserController';
import { WalletController } from 'api/controllers/WalletController';

const onDeleteUser = (WalletControllerInstance: WalletController, UserControllerInstance: UserController) => async (
  username: string
) => {
  const user = await UserControllerInstance.getByUsername(username);

  if (!user) return

  // NOTE: there are also multiple fk constraints I need to check!!!
  // such as ListedProducts and Transactions, need to discuss with Aaron
  // what we want to do about it
  await WalletControllerInstance.delete(user.id);
  await UserControllerInstance.deleteByUsername(username);
};

export default onDeleteUser;
