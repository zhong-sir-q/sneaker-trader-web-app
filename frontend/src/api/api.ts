import {
  Sneaker,
  Brand,
  SneakerName,
  Colorway,
  MailAfterPurchasePayload,
  BuyerPurchasedSneaker,
  AppSneaker,
  ListedSneakerSeller,
} from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

const SELLERS_API_URL = API_BASE_URL + 'sellers/';

// products
const PRODUCT_API_URL = API_BASE_URL + 'product/';
const HELPER_INFO_API_URL = API_BASE_URL + 'helper_info/';

// transaction related
const TRANSACTIONS_API_URL = API_BASE_URL + 'transactions/';

// external api
const AWS_API_URL = API_BASE_URL + 'aws/';
const MAIL_API_URL = API_BASE_URL + 'mail/';

// RULE: NEVER assign keys, IF I ONLY HAVE ONE JSON body or in the server response
const formatRequestOptions = (data: any, contentType?: string, method?: 'POST' | 'PUT'): RequestInit => ({
  method: method || 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': contentType || 'application/json',
  },
});

// sellers
export const getSellersBySneakerNameSize = (sneakerName: string, size: number): Promise<ListedSneakerSeller[]> =>
  fetch(SELLERS_API_URL + `?sneakerName=${sneakerName}&size=${size}`).then((res) => res.json());

// product
// returns the insert id of the product
export const createSneaker = (sneaker: AppSneaker): Promise<number> =>
  fetch(PRODUCT_API_URL, formatRequestOptions(sneaker)).then((res) => res.json());

export const getProductByNameColorwaySize = (nameColorway: string, size: number): Promise<Sneaker | undefined> =>
  fetch(PRODUCT_API_URL + `${nameColorway}/${size}`).then((res) => res.json());

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
export const mailAfterPurchase = (payload: MailAfterPurchasePayload) =>
  fetch(MAIL_API_URL + 'confirmPurchase', formatRequestOptions(payload));

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

export const getPurchasedProductsByBuyerId = (buyerId: number): Promise<BuyerPurchasedSneaker[]> =>
  fetch(TRANSACTIONS_API_URL + `purchased/${buyerId}`).then((res) => res.json());
