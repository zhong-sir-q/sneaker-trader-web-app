import { API_BASE_URL } from 'routes';
import { User } from '../../../shared';

// TODO: refactor all the endpoints, i.e. declare USER_URL and PRODUCT_URL as separate variables
export const fetchUserByEmail = async (email: string) => {
  // NOTE: not sure if special characters like email will be corrected displayed in the url
  const endpoint = API_BASE_URL + `user/${email}`;

  return fetch(endpoint).then((res) => res.json());
};

// Create the user in the database
export const createUser = async (user: User) => {
  const endpoint = API_BASE_URL + 'user';
  const fetchOptions: RequestInit = {
    method: 'POST',
    // the backend gets the body using the user key
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(endpoint, fetchOptions)
    .then((res) => res.json())
    .then((resJson) => resJson.user)
    .catch((err) => console.log('Error creating the user in the database', err));
};
