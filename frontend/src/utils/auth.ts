import { Auth } from 'aws-amplify';
import { fetchUserByEmail } from 'api/api';
import { User } from '../../../shared';

export const fetchCognitoUser = () =>
  Auth.currentAuthenticatedUser()

export const getCurrentUser = async (cognitoData?: any): Promise<User> => {
  const cognitoUser = cognitoData || await fetchCognitoUser()
  const email = cognitoUser.email || cognitoUser.attributes.email;
  
  return fetchUserByEmail(email)
}

export const signIn = (email: string, pw: string) =>
  Auth.signIn(email, pw)
    .then((user) => user)

/**
 * @param history value from useHistory
 */
export const signOut = async (history : any) => {
  await Auth.signOut();
  history.push('/');
};
