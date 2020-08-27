import { Auth } from 'aws-amplify';

export const fetchCurrentUser = () => Auth.currentAuthenticatedUser()
  .then((user) => user)
  .catch((err) => console.log(err));
