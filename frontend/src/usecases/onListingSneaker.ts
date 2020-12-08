import { ListedSneakerFormPayload, ListingFormSneaker, User } from '../../../shared';

import { ListedSneakerController } from 'api/controllers/ListedSneakerController';
import { HelperInfoController } from 'api/controllers/HelperInfoController';
import { SneakerController } from 'api/controllers/SneakerController';
import { AwsController } from 'api/controllers/AwsController';
import { MailController } from 'api/controllers/MailController';

const onListingSneaker = (
  awsController: AwsController,
  sneakerController: SneakerController,
  listedSneakerController: ListedSneakerController,
  helperInfoController: HelperInfoController,
  mailController: MailController
) => async (
  imgFormData: FormData,
  user: User,
  listingFormSneaker: ListingFormSneaker,
  getCreateListedSneakerPayload: (s3ImgUrls: string[]) => ListedSneakerFormPayload,
  brand: string | undefined,
  colorway: string | undefined,
  name: string | undefined
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

  const listedSneaker = getCreateListedSneakerPayload(uploadedUrls);

  const listedSneakerId = await listedSneakerController.create({
    ...listedSneaker,
    userId: user.id,
    productId: prodId,
    imageUrls: uploadedUrls.join(','),
  });

  if (listedSneaker.prodStatus === 'new sneaker request') {
    const newProduct = await sneakerController.getById(prodId);
    // this will not happen, the sneaker must exist after the operations above
    if (!newProduct) return;
    const listedSneakerPayload = { ...newProduct, ...listedSneaker, productId: prodId, id: listedSneakerId };

    mailController.mailAdminAfterNewRequest({ user, listedSneaker: listedSneakerPayload });
  }

  // not need to await because the user does not need to wait for the response of the calls
  if (brand) helperInfoController.createBrand({ brand });
  if (colorway) helperInfoController.createColorway({ colorway });
  if (name) helperInfoController.createSneakerName({ name });
};

export default onListingSneaker;
