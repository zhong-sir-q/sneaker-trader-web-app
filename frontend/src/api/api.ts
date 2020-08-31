import { User, Sneaker } from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const USER_API_URL = API_BASE_URL + 'user/';
const PRODUCT_API_URL = API_BASE_URL + 'product/';
const AWS_API_URL = API_BASE_URL + 'aws/';

// RULE: NEVER assign keys, IF I ONLY HAVE ONE JSON body
const formatPostRequestOptions = (data: any, contentType?: string): RequestInit => ({
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': contentType || 'application/json',
  },
});

// user apis
export const fetchUserByEmail = async (email: string): Promise<User> => fetch(USER_API_URL + email).then((res) => res.json());

// Create the user in the database
export const createUser = async (user: User): Promise<User> =>
  fetch(USER_API_URL, formatPostRequestOptions(user)).then((res) => res.json());

export const updateUser = async (user: User) => fetch(USER_API_URL + 'update', formatPostRequestOptions(user)).then((res) => res);

// product apis
export const createProduct = (product: Sneaker): Promise<Sneaker> =>
  fetch(PRODUCT_API_URL, formatPostRequestOptions(product)).then((res) => res.json());

type SignS3ResultType = {
  signedRequestUrl: string;
  accessImageUrl: string;
};

export const uploadS3SignleImage = async (formData: FormData) => {
  return fetch(AWS_API_URL + 'upload', {
    method: 'POST',
    body: formData
  }).then(res => res.body)
}

export const uploadS3MultipleImages = async (formData: FormData): Promise<string[]> => {
  return fetch(AWS_API_URL + 'uploads', {
    method: 'POST',
    body: formData
  }).then(res => res.json())
}
