import { Auth } from 'aws-amplify';

export const fetchCognitoUser = () =>
  Auth.currentAuthenticatedUser()

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
