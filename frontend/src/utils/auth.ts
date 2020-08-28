import { Auth } from 'aws-amplify';

export const fetchCurrentUser = () =>
  Auth.currentAuthenticatedUser()
    .then((user) => user)
    .catch((err) => console.log(err));

export const cognitoSignIn = (email: string, pw: string) =>
  Auth.signIn(email, pw)
    .then((user) => user)
    .catch((err) => err);
