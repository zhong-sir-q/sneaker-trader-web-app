import { uploadS3MultipleImages } from 'api/api';

import { ListedSneakerFormPayload, ListingFormSneaker } from '../../../shared';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import SneakerControllerInstance from 'api/controllers/SneakerController';

const onListingSneaker = async (
  imgFormData: FormData,
  nameColorway: string,
  size: number,
  currentUserId: number,
  listingFormSneaker: ListingFormSneaker,
  listedSneakerFormPayload: ListedSneakerFormPayload,
  brand: string | undefined,
  colorway: string | undefined,
  name: string | undefined
) => {
  const uploadedUrls = await uploadS3MultipleImages(imgFormData);
  const formattedUrls = uploadedUrls.join(',');

  let prodId: number;
  const product = await SneakerControllerInstance.getByNameColorwaySize(nameColorway, size);

  if (product) prodId = product.id;
  else prodId = await SneakerControllerInstance.create({ ...listingFormSneaker, imageUrls: formattedUrls });

  await ListedSneakerControllerInstance.create({
    ...listedSneakerFormPayload,
    userId: currentUserId,
    productId: prodId,
    imageUrls: formattedUrls
  });

  if (brand) await HelperInfoControllerInstance.createBrand({ brand });
  if (colorway) await HelperInfoControllerInstance.createColorway({ colorway });
  if (name) await HelperInfoControllerInstance.createSneakerName({ name });
};

export default onListingSneaker;