import { uploadS3MultipleImages, getProductByNameColorwaySize, createSneaker } from 'api/api';

import { ListedSneakerPayload, ListingFormSneaker } from '../../../shared';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';

const handleListingSneaker = async (
  imgFormData: FormData,
  nameColorway: string,
  size: number,
  currentUserId: number,
  listingFormSneaker: ListingFormSneaker,
  listedSneakerPayload: ListedSneakerPayload,
  brand: string | undefined,
  colorway: string | undefined,
  name: string | undefined
) => {
  const uploadedUrls = await uploadS3MultipleImages(imgFormData);
  const formattedUrls = uploadedUrls.join(',');

  let prodId: number;
  const product = await getProductByNameColorwaySize(nameColorway, size);

  if (product) prodId = product.id!;
  else prodId = await createSneaker({ ...listingFormSneaker, imageUrls: formattedUrls });

  await ListedSneakerControllerInstance.create({
    ...listedSneakerPayload,
    userId: currentUserId,
    productId: prodId,
    imageUrls: formattedUrls
  });

  if (brand) await HelperInfoControllerInstance.createBrand({ brand });
  if (colorway) await HelperInfoControllerInstance.createColorway({ colorway });
  if (name) await HelperInfoControllerInstance.createSneakerName({ name });
};

export default handleListingSneaker;
