import {
  MailAfterPurchasePayload,
  ListedSneakerSeller,
} from '../../../shared';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

const SELLERS_API_URL = API_BASE_URL + 'sellers/';

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
export const getSellersBySneakerNameSize = (nameColorway: string, size: number): Promise<ListedSneakerSeller[]> =>
  fetch(SELLERS_API_URL + `?sneakerName=${nameColorway}&size=${size}`).then((res) => res.json());

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
