import { User, Sneaker, ListedProduct, SizeMinPriceGroupType, Brand, SneakerName, Colorway } from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const USER_API_URL = API_BASE_URL + 'user/';
const PRODUCT_API_URL = API_BASE_URL + 'product/';
const LISTED_PRODUCT_API_URL = API_BASE_URL + 'listed_product/';
const AWS_API_URL = API_BASE_URL + 'aws/';
const SELLERS_API_URL = API_BASE_URL + 'sellers/';
const HELPER_INFO_API_URL = API_BASE_URL + 'helperInfo/'

// RULE: NEVER assign keys, IF I ONLY HAVE ONE JSON body or in the server response
const formatPostRequestOptions = (data: any, contentType?: string): RequestInit => ({
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': contentType || 'application/json',
  },
});

// user
export const fetchUserByEmail = (email: string): Promise<User> => fetch(USER_API_URL + email).then((res) => res.json());

// sellers
export const getSellersBySneakerNameSize = (
  sneakerName: string,
  size: number
): Promise<(Pick<User, 'userName' | 'email'> & { askingPrice: number })[]> =>
  fetch(SELLERS_API_URL + `?sneakerName=${sneakerName}&size=${size}`).then((res) => res.json());

// Create the user in the database
export const createUser = (user: User) => fetch(USER_API_URL, formatPostRequestOptions(user)).then((res) => res.json());

export const updateUser = (user: User) =>
  fetch(USER_API_URL + 'update', formatPostRequestOptions(user)).then((res) => res);

// product
// returns the insert id of the product
export const createProduct = (product: Sneaker): Promise<number> =>
  fetch(PRODUCT_API_URL, formatPostRequestOptions(product)).then((res) => res.json());

// listed product
export const createListedProduct = (listedProduct: ListedProduct) =>
  fetch(LISTED_PRODUCT_API_URL, formatPostRequestOptions(listedProduct)).then((res) => res.json());

export const getAllListedProducts = (): Promise<Sneaker[]> => fetch(LISTED_PRODUCT_API_URL).then((res) => res.json());

export const getGallerySneakers = (): Promise<Sneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + 'gallery').then((res) => res.json());

export const getUserSizeGroupedPrice = (sneakerName: string): Promise<SizeMinPriceGroupType> =>
  fetch(LISTED_PRODUCT_API_URL + `?name=${sneakerName}`).then((res) => res.json());

export const getSneakersBySize = (size: string): Promise<Sneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + `?sizes=${size}`).then((res) => res.json());

// s3
export const uploadS3SignleImage = (formData: FormData) =>
  fetch(AWS_API_URL + 'upload', {
    method: 'POST',
    body: formData,
  }).then((res) => res.body);

export const uploadS3MultipleImages = (formData: FormData): Promise<string[]> =>
  fetch(AWS_API_URL + 'uploads', {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());

// helperInfo such as brands, sneaker names and color ways etc.
export const getBrands = (): Promise<Brand[]> => fetch(HELPER_INFO_API_URL + 'brands').then(res => res.json())

export const getSneakerNames = (): Promise<SneakerName[]> => fetch(HELPER_INFO_API_URL + 'sneakerNames').then(res => res.json())

export const getColorways = (): Promise<Colorway[]> => fetch(HELPER_INFO_API_URL + 'colorways').then(res => res.json())
