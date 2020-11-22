import { ListedSneakerFormPayload, ListingFormSneaker } from '../../../shared';

import { ListedSneakerController } from 'api/controllers/ListedSneakerController';
import { HelperInfoController } from 'api/controllers/HelperInfoController';
import { SneakerController } from 'api/controllers/SneakerController';
import { AwsController } from 'api/controllers/AwsController';
import { formatSneakerNameColorway } from 'utils/utils';

const onListingSneaker = (
  AwsControllerInstance: AwsController,
  SneakerControllerInstance: SneakerController,
  ListedSneakerControllerInstance: ListedSneakerController,
  HelperInfoControllerInstance: HelperInfoController
) => async (
  imgFormData: FormData,
  currentUserId: number,
  listingFormSneaker: ListingFormSneaker,
  getCreateListedSneakerPayload: (s3ImgUrls: string[]) => ListedSneakerFormPayload,
  brand: string | undefined,
  colorway: string | undefined,
  name: string | undefined
) => {
  const uploadedUrls = await AwsControllerInstance.uploadS3MultipleImages(imgFormData);

  let prodId: number;
  const nameColorway = formatSneakerNameColorway(listingFormSneaker.name, listingFormSneaker.colorway);

  const product = await SneakerControllerInstance.getByNameColorwaySize(nameColorway, listingFormSneaker.size);

  if (product) prodId = product.id;
  else prodId = await SneakerControllerInstance.create({ ...listingFormSneaker, imageUrls: uploadedUrls.join(',') });

  await ListedSneakerControllerInstance.create({
    ...getCreateListedSneakerPayload(uploadedUrls),
    userId: currentUserId,
    productId: prodId,
    imageUrls: uploadedUrls.join(','),
  });

  // not need to await because the user does not need to wait for the response of the calls
  if (brand) HelperInfoControllerInstance.createBrand({ brand });
  if (colorway) HelperInfoControllerInstance.createColorway({ colorway });
  if (name) HelperInfoControllerInstance.createSneakerName({ name });
};

export default onListingSneaker;
