import {
  uploadS3MultipleImages,
  getProductByNameColorwaySize,
  createSneaker,
  createListedSneaker,
  createBrand,
  createColorway,
  createSneakerName,
} from 'api/api';

import { ListedSneakerPayload, ListingFormSneaker } from '../../../shared';

const handleListingSneaker = async (
  imgFormData: FormData,
  nameColorway: string,
  size: number,
  currentUserId: number,
  listingFormSneaker: ListingFormSneaker,
  listedSneakerPayload: ListedSneakerPayload,
  brand?: string,
  colorway?: string,
  name?: string
) => {
  const uploadedUrls = await uploadS3MultipleImages(imgFormData);

  let prodId: number;

  const product = await getProductByNameColorwaySize(nameColorway, size);

  if (product) prodId = product.id!;
  else {
    const formattedUrls = uploadedUrls.join(',');

    prodId = await createSneaker({ ...listingFormSneaker, imageUrls: formattedUrls });
  }

  await createListedSneaker({ ...listedSneakerPayload, userId: currentUserId, productId: prodId });

  if (brand) await createBrand({ brand });
  if (colorway) await createColorway({ colorway });
  if (name) await createSneakerName({ name });
};

export default handleListingSneaker;
