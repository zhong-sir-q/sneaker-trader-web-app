import {
  User,
  Sneaker,
  SizeMinPriceGroupType,
  Brand,
  SneakerName,
  Colorway,
  MailAfterPurchasePayload,
  SneakerAsk,
  SneakerStatus,
  TopupWalletPayload,
  DecreaseWalletPayload,
  SellerListedSneaker,
  BuyerPurchasedSneaker,
  DomainSneaker,
  DomainListedSneaker,
  CreateTransactionPayload,
  CreateUserPayload,
  GallerySneaker,
} from '../../../shared';

import { Seller } from 'pages/SellersList';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

// users
const USER_API_URL = API_BASE_URL + 'user/';
const SELLERS_API_URL = API_BASE_URL + 'sellers/';

// products
const PRODUCT_API_URL = API_BASE_URL + 'product/';
const HELPER_INFO_API_URL = API_BASE_URL + 'helper_info/';
const LISTED_PRODUCT_API_URL = API_BASE_URL + 'listed_product/';

// wallet
const WALLET_API_URL = API_BASE_URL + 'wallet/';

// transaction related
const TRANSACTION_API_URL = API_BASE_URL + 'transaction/';
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

// user
export const fetchUserByEmail = (email: string): Promise<User> => fetch(USER_API_URL + email).then((res) => res.json());

// sellers
export const getSellersBySneakerNameSize = (sneakerName: string, size: number): Promise<Seller[]> =>
  fetch(SELLERS_API_URL + `?sneakerName=${sneakerName}&size=${size}`).then((res) => res.json());

// Create the user in the database
export const createUser = (user: CreateUserPayload) => fetch(USER_API_URL, formatRequestOptions(user)).then((res) => res.json());

export const updateUser = (user: User) =>
  fetch(USER_API_URL, formatRequestOptions(user, undefined, 'PUT')).then((res) => res);

// product
// returns the insert id of the product
export const createSneaker = (sneaker: DomainSneaker): Promise<number> =>
  fetch(PRODUCT_API_URL, formatRequestOptions(sneaker)).then((res) => res.json());

export const getProductByNameColorwaySize = (nameColorway: string, size: number): Promise<Sneaker | undefined> =>
  fetch(PRODUCT_API_URL + `${nameColorway}/${size}`).then((res) => res.json());

// listed product
export const createListedSneaker = (listedSneaker: DomainListedSneaker) =>
  fetch(LISTED_PRODUCT_API_URL, formatRequestOptions(listedSneaker)).then((res) => res.json());

export const getAllListedProducts = (): Promise<DomainSneaker[]> => fetch(LISTED_PRODUCT_API_URL).then((res) => res.json());

export const getGallerySneakers = (): Promise<GallerySneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + 'gallery').then((res) => res.json());

export const getUserSizeGroupedPrice = (sneakerName: string): Promise<SizeMinPriceGroupType> =>
  fetch(LISTED_PRODUCT_API_URL + `?name=${sneakerName}`).then((res) => res.json());

export const getSneakersBySize = (size: string): Promise<GallerySneaker[]> =>
  fetch(LISTED_PRODUCT_API_URL + `?sizes=${size}`).then((res) => res.json());

export const getAllAsksByNameColorway = (nameColorway: string): Promise<SneakerAsk[]> =>
  fetch(LISTED_PRODUCT_API_URL + `allAsks?nameColorway=${nameColorway}`).then((res) => res.json());

export const purchaseListedProduct = (listedProduct: { id: number; sellerId: number }) =>
  fetch(LISTED_PRODUCT_API_URL + 'purchase', formatRequestOptions(listedProduct, undefined, 'PUT'));

export const updateProdStatus = (listedProductId: number, prodStatus: SneakerStatus) =>
  fetch(LISTED_PRODUCT_API_URL + `status/${listedProductId}`, formatRequestOptions({ prodStatus }, undefined, 'PUT'));

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

// wallet
export const getWalletBalanceByUserId = (userId: number): Promise<number | undefined> =>
  fetch(WALLET_API_URL + userId).then((res) => res.json());

export const topupWalletBalance = (data: TopupWalletPayload) =>
  fetch(WALLET_API_URL + 'topup', formatRequestOptions(data, undefined, 'PUT'));

export const decreaseWalletBalance = (data: DecreaseWalletPayload) =>
  fetch(WALLET_API_URL + 'decreaseBalance', formatRequestOptions(data, undefined, 'PUT'));

// transaction related
export const createProductTransaction = (payload: CreateTransactionPayload) =>
  fetch(TRANSACTION_API_URL, formatRequestOptions(payload, undefined, 'POST'));

export const getListedProductsBySellerId = (sellerId: number): Promise<SellerListedSneaker[]> =>
  fetch(TRANSACTIONS_API_URL + `listed/${sellerId}`).then((res) => res.json());

export const getPurchasedProductsByBuyerId = (buyerId: number): Promise<BuyerPurchasedSneaker[]> =>
  fetch(TRANSACTIONS_API_URL + `purchased/${buyerId}`).then((res) => res.json());

// user rating
export const rateBuyer = (listedProductId: number, rating: number) =>
  fetch(
    TRANSACTION_API_URL + `/rating/buyer/${listedProductId}`,
    formatRequestOptions({ rating }, undefined, 'PUT')
  ).then(() => {});

export const rateSeller = (listedProductId: number, rating: number) =>
  fetch(
    TRANSACTION_API_URL + `/rating/seller/${listedProductId}`,
    formatRequestOptions({ rating }, undefined, 'PUT')
  ).then(() => {});
