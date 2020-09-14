import {
  User,
  Sneaker,
  ListedProduct,
  SizeMinPriceGroupType,
  Brand,
  SneakerName,
  Colorway,
  ContactSellerMailPayload,
  SneakerAsk,
} from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const USER_API_URL = API_BASE_URL + 'user/';
const PRODUCT_API_URL = API_BASE_URL + 'product/';
const LISTED_PRODUCT_API_URL = API_BASE_URL + 'listed_product/';
const AWS_API_URL = API_BASE_URL + 'aws/';
const SELLERS_API_URL = API_BASE_URL + 'sellers/';
const HELPER_INFO_API_URL = API_BASE_URL + 'helper_info/';
const MAIL_API_URL = API_BASE_URL + 'mail/';

// RULE: NEVER assign keys, IF I ONLY HAVE ONE JSON body or in the server response
const formatRequestOptions = (data: any, contentType?: string, method?: 'POST' | 'PUT'): RequestInit => ({
  method: method || 'POST',
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
export const createUser = (user: User) => fetch(USER_API_URL, formatRequestOptions(user)).then((res) => res.json());

export const updateUser = (user: User) =>
  fetch(USER_API_URL, formatRequestOptions(user, undefined, 'PUT')).then((res) => res);

// product
// returns the insert id of the product
export const createProduct = (product: Sneaker): Promise<number> =>
  fetch(PRODUCT_API_URL, formatRequestOptions(product)).then((res) => res.json());

// listed product
export const createListedProduct = (listedProduct: ListedProduct) =>
  fetch(LISTED_PRODUCT_API_URL, formatRequestOptions(listedProduct)).then((res) => res.json());

export const getAllListedProducts = (): Promise<Sneaker[]> => fetch(LISTED_PRODUCT_API_URL).then((res) => res.json());

export const getGallerySneakers = (): Promise<Sneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + 'gallery').then((res) => res.json());

export const getUserSizeGroupedPrice = (sneakerName: string): Promise<SizeMinPriceGroupType> =>
  fetch(LISTED_PRODUCT_API_URL + `?name=${sneakerName}`).then((res) => res.json());

export const getSneakersBySize = (size: string): Promise<Sneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + `?sizes=${size}`).then((res) => res.json());

export const getAllAsksByNameColorway = (nameColorway: string): Promise<SneakerAsk[]> =>
  fetch(LISTED_PRODUCT_API_URL + `allAsks?nameColorway=${nameColorway}`).then((res) => res.json());

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

// mail
export const contactSellerAfterPurchase = (payload: ContactSellerMailPayload) =>
  fetch(MAIL_API_URL + 'seller', formatRequestOptions(payload));

// helper_info such as brands, sneaker names and color ways etc.
export const getBrands = (): Promise<Brand[]> => fetch(HELPER_INFO_API_URL + 'brands').then((res) => res.json());

export const getSneakerNames = (): Promise<SneakerName[]> =>
  fetch(HELPER_INFO_API_URL + 'sneakerNames').then((res) => res.json());

export const getColorways = (): Promise<Colorway[]> =>
  fetch(HELPER_INFO_API_URL + 'colorways').then((res) => res.json());

export const createBrand = (brand: Brand): Promise<any> =>
  fetch(HELPER_INFO_API_URL + 'brands', formatRequestOptions(brand));

export const createSneakerName = (name: SneakerName): Promise<any> =>
  fetch(HELPER_INFO_API_URL + 'sneakerNames', formatRequestOptions(name));

export const createColorway = (colorway: Colorway): Promise<any> =>
  fetch(HELPER_INFO_API_URL + 'colorways', formatRequestOptions(colorway));
