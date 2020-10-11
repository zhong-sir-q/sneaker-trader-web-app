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
  listedSneakerFormPayload: ListedSneakerFormPayload,
  brand: string | undefined,
  colorway: string | undefined,
  name: string | undefined
) => {
  const uploadedUrls = await AwsControllerInstance.uploadS3MultipleImages(imgFormData);

  const formattedUrls = uploadedUrls.join(',');

  let prodId: number;
  const nameColorway = formatSneakerNameColorway(listingFormSneaker.name, listingFormSneaker.colorway);

  const product = await SneakerControllerInstance.getByNameColorwaySize(nameColorway, listingFormSneaker.size);

  if (product) prodId = product.id;
  else prodId = await SneakerControllerInstance.create({ ...listingFormSneaker, imageUrls: formattedUrls });

  await ListedSneakerControllerInstance.create({
    ...listedSneakerFormPayload,
    userId: currentUserId,
    productId: prodId,
    imageUrls: formattedUrls,
  });

  if (brand) await HelperInfoControllerInstance.createBrand({ brand });
  if (colorway) await HelperInfoControllerInstance.createColorway({ colorway });
  if (name) await HelperInfoControllerInstance.createSneakerName({ name });
};

export default onListingSneaker;
