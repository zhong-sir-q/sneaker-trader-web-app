import { AwsController } from 'api/controllers/AwsController';
import { SneakerController } from 'api/controllers/SneakerController';
import { HelperInfoController } from 'api/controllers/HelperInfoController';
import { ListedSneakerController } from 'api/controllers/ListedSneakerController';

import { ListingFormSneaker, ListedSneakerFormPayload } from '../../../shared';

const onEditListedSneaker = (
  awsController: AwsController,
  sneakerController: SneakerController,
  listedSneakerController: ListedSneakerController,
  helperInfoController: HelperInfoController
) => async (
  listedSneakerId: number,
  imgFormData: FormData,
  currentUserId: number,
  listingFormSneaker: ListingFormSneaker,
  brand: string | undefined,
  colorway: string | undefined,
  name: string | undefined,
  getCreateListedSneakerPayload: (s3ImgUrls: string[]) => ListedSneakerFormPayload
) => {
  const uploadedUrls = await awsController.uploadS3MultipleImages(imgFormData);

  let prodId: number;

  const product = await sneakerController.getByNameColorwaySize(
    listingFormSneaker.name,
    listingFormSneaker.colorway,
    listingFormSneaker.size
  );

  if (product) prodId = product.id;
  else prodId = await sneakerController.create({ ...listingFormSneaker, imageUrls: uploadedUrls.join(',') });

  await listedSneakerController.update(listedSneakerId, {
    ...getCreateListedSneakerPayload(uploadedUrls),
    userId: currentUserId,
    productId: prodId,
    imageUrls: uploadedUrls.join(','),
  });

  // not need to await because the user does not need to wait for the response of the calls
  if (brand) helperInfoController.createBrand({ brand });
  if (colorway) helperInfoController.createColorway({ colorway });
  if (name) helperInfoController.createSneakerName({ name });
};

export default onEditListedSneaker;
