import { v4 as uuidV4 } from 'uuid';
import { concatPaths } from './formatApiEndpoint';
import { ADMIN } from 'routes';
import { SneakerListingFormStateType } from 'providers/SneakerListingFormProvider';
import { ListedSneakerFormPayload, SneakerStatus } from '../../../shared';

export const formatSneakerPathName = (name: string, color: string) =>
  formatSneakerNameColorway(name, color).split(' ').join('-');

export const formatSneakerNameColorway = (name: string, colorway: string) => `${name} ${colorway}`;

export const getMainDisplayImgUrl = (imgUrls: string | undefined) => imgUrls?.split(',')[0];

export const upperCaseFirstLetter = (s: string | undefined) => {
  if (!s) return s;

  const firstLetter = s[0];
  return firstLetter.toUpperCase() + s.slice(1);
};

export const mapUpperCaseFirstLetter = (s: string, separator: string): string => {
  const arr = s.split(separator);

  return arr.map(upperCaseFirstLetter).join(separator);
};

export const range = (start: number, end: number, step: number): number[] => {
  let result: number[] = [];

  if (step === 0) return [start];

  if (start > end && step > 0) return [];

  for (let num = start; num !== end; num += step) result.push(num);

  return result;
};

export const createEditListedSneakerPath = (listedSneakerId: number) =>
  concatPaths(ADMIN, 'edit', `listed-sneaker-${listedSneakerId}`);

// this method is coupled to createEditListedSneakerPath
export const getListedSneakerIdFromPath = (pathname: string): number => {
  const paths = pathname.split('/');
  const listedSneakerPart = paths[paths.length - 1];
  const parts = listedSneakerPart.split('-');
  const result = parts[parts.length - 1];

  return Number(result);
};

const createBlob = (fileDataUrl: string) => fetch(fileDataUrl).then((res) => res.blob());

const createPreviewFile = (f: File) => {
  const previewDataUrl = URL.createObjectURL(f);
  return Object.assign(f, { preview: previewDataUrl, id: uuidV4() });
};

// these two functions can be refactored
export const createPreviewFileFromDataUrl = async (url: string) => {
  const file = new File([await createBlob(url)], uuidV4());
  return createPreviewFile(file);
};

export const createPreviewFileFromBlob = (blob: Blob) => {
  const file = new File([blob], uuidV4());
  return createPreviewFile(file);
};

export const formatListedSneakerPayload = (sneaker: SneakerListingFormStateType, quantity?: number) => (
  s3UploadedUrls: string[]
): ListedSneakerFormPayload => ({
  askingPrice: Number(sneaker.askingPrice),
  sizeSystem: sneaker.sizeSystem,
  currencyCode: sneaker.currencyCode,
  prodCondition: sneaker.prodCondition,
  quantity: quantity || 1,
  prodStatus: 'listed' as SneakerStatus,
  conditionRating: sneaker.conditionRating,
  description: sneaker.description,
  serialNumber: '',
  originalPurchasePrice: Number(sneaker.originalPurchasePrice),
  mainDisplayImage: s3UploadedUrls[0],
});

export const formatSneaker = (s: SneakerListingFormStateType) => {
  const name = mapUpperCaseFirstLetter(s.name, ' ');
  const colorway = mapUpperCaseFirstLetter(s.colorway, ' ');
  const brand = mapUpperCaseFirstLetter(s.brand, ' ');

  const size = Number(s.size);

  return { name, colorway, brand, size };
};
