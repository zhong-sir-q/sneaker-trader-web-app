import { User } from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const USER_API_URL = API_BASE_URL + 'user/';

// TODO: refactor all the endpoints, i.e. declare USER_URL and PRODUCT_URL as separate variables
export const fetchUserByEmail = async (email: string) => fetch(USER_API_URL + email).then((res) => res.json());

// Create the user in the database
export const createUser = async (user: User) => {
  const fetchOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(USER_API_URL, fetchOptions)
    .then((res) => res.json())
    .then((resJson) => resJson.user)
};

export const updateUser = async (user: User) => {
  const endpoint = USER_API_URL + 'update'

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json',
    }
  }

  return fetch(endpoint, options).then(res => res)
};
