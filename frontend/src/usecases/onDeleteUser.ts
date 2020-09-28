import UserControllerInstance from "api/controllers/UserController"
import WalletControllerInstance from "api/controllers/WalletController"


const onDeleteUser = async (username: string) => {
  const user = await UserControllerInstance.getByUsername(username)

  // NOTE: there are also multiple fk constraints I need to check!!!
  // such as ListedProducts and Transactions, need to discuss with Aaron
  // what we want to do about it  
  await WalletControllerInstance.delete(user.id)
  await UserControllerInstance.deleteByUsername(username)
}

export default onDeleteUser
