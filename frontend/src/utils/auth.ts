import { Auth } from 'aws-amplify';
import { User } from '../../../shared';
import UserControllerInstance from 'api/controllers/UserController';

export const fetchCognitoUser = () => Auth.currentAuthenticatedUser();

export const getCurrentUser = async (cognitoData?: any): Promise<User | null> => {
  const cognitoUser = cognitoData || (await fetchCognitoUser());
  const email = cognitoUser.email || cognitoUser.attributes.email;

  return UserControllerInstance.getByEmail(email);
};

export const signIn = (email: string, pw: string) => Auth.signIn(email, pw).then((user) => user);

/**
 * @param history value from useHistory
 */
export const signOut = async (history?: any, redirectPath?: string) => {
  await Auth.signOut();
  if (history) history.push(redirectPath);
};
