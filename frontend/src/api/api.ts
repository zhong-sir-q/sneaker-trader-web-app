import { User, Sneaker, ListedProduct, SizeMinPriceGroupType } from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const USER_API_URL = API_BASE_URL + 'user/';
const PRODUCT_API_URL = API_BASE_URL + 'product/';
const PRODUCTS_API_URL = API_BASE_URL + 'products/';
const LISTED_PRODUCT_API_URL = API_BASE_URL + 'listed_product/';
const AWS_API_URL = API_BASE_URL + 'aws/';

// RULE: NEVER assign keys, IF I ONLY HAVE ONE JSON body or in the server response
const formatPostRequestOptions = (data: any, contentType?: string): RequestInit => ({
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': contentType || 'application/json',
  },
});

// user
export const fetchUserByEmail = async (email: string): Promise<User> => fetch(USER_API_URL + email).then((res) => res.json());

// Create the user in the database
export const createUser = async (user: User) => fetch(USER_API_URL, formatPostRequestOptions(user)).then((res) => res.json());

export const updateUser = async (user: User) => fetch(USER_API_URL + 'update', formatPostRequestOptions(user)).then((res) => res);

// product
// returns the insert id of the product
export const createProduct = (product: Sneaker): Promise<number> =>
  fetch(PRODUCT_API_URL, formatPostRequestOptions(product)).then((res) => res.json());

// products
export const getProducts = (): Promise<Sneaker[]> => fetch(PRODUCTS_API_URL).then((res) => res.json());

// listed product
export const createListedProduct = async (listedProduct: ListedProduct) =>
  fetch(LISTED_PRODUCT_API_URL, formatPostRequestOptions(listedProduct)).then((res) => res.json());

export const getGallerySneakers = async (): Promise<Sneaker[]> => fetch(LISTED_PRODUCT_API_URL + 'gallery').then((res) => res.json());

export const getUserSizeGroupedPrice = async (sneakerName: string): Promise<SizeMinPriceGroupType> =>
  fetch(LISTED_PRODUCT_API_URL + `?name=${sneakerName}`).then((res) => res.json());

export const getSneakersBySize = async (size: string): Promise<Sneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + `?sizes=${size}`).then((res) => res.json());

// s3
export const uploadS3SignleImage = async (formData: FormData) => {
  return fetch(AWS_API_URL + 'upload', {
    method: 'POST',
    body: formData,
  }).then((res) => res.body);
};

export const uploadS3MultipleImages = async (formData: FormData): Promise<string[]> => {
  return fetch(AWS_API_URL + 'uploads', {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());
};
