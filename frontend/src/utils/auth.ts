import { Auth } from 'aws-amplify';

export const fetchCognitoUser = () =>
  Auth.currentAuthenticatedUser()
    .then((user) => user)
    .catch((err) => console.log(err));

export const signIn = (email: string, pw: string) =>
  Auth.signIn(email, pw)
    .then((user) => user)
    .catch((err) => err);

/**
 * @param history value from useHistory
 */
export const signOut = async (history : any) => {
  await Auth.signOut();
  history.push('/');
};
