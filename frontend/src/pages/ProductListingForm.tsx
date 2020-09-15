import React, { useState } from 'react';

import { Col, Container, Progress } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SubmissionSuccess from 'components/SubmissionSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';

import {
  createProduct,
  uploadS3MultipleImages,
  createListedProduct,
  createBrand,
  createSneakerName,
  createColorway,
  getProductByNamecolorwaySize,
} from 'api/api';

import { Sneaker, ListedProduct, SneakerCondition } from '../../../shared';

import PreviewImagesDropZone, { PreviewFile } from 'components/PreviewImagesDropZone';
import { getCurrentUser } from 'utils/auth';


export type ListingFormSneakerStateType = Omit<Sneaker, 'imageUrls' | 'price'> &
  Pick<ListedProduct, 'sizeSystem' | 'currencyCode' | 'prodCondition' | 'askingPrice'>;

const INIT_SNEAKER_STATE: ListingFormSneakerStateType = {
  name: '',
  brand: '',
  size: '',
  colorway: '',
  askingPrice: '',
  description: '',
  sizeSystem: '',
  currencyCode: '',
  prodCondition: '' as SneakerCondition,
};

const formatListedProduct = (
  sneaker: ListingFormSneakerStateType,
  userId: number,
  productId: number,
  quantity?: number
): ListedProduct => ({
  userId,
  productId,
  askingPrice: Number(sneaker.askingPrice),
  sizeSystem: sneaker.sizeSystem,
  currencyCode: sneaker.currencyCode,
  prodCondition: sneaker.prodCondition,
  quantity: quantity || 1,
  sold: 0,
});

const formatProductSneaker = (s: ListingFormSneakerStateType): Omit<Sneaker, 'imageUrls' | 'price'> => {
  const { name, colorway, brand, size, description } = s;

  return { name, colorway, brand, size, description };
};

// A 4-step form, first to submit the basic info, second to preview with the
// option to go back and change, third to confirm and upload the product. Lastly
// prompt the success message to the user

const ProductListingForm = () => {
  const [sneaker, setSneaker] = useState(INIT_SNEAKER_STATE);
  // not part of the sneaker, so separate the state out
  const [billingInfo, setBillingInfo] = useState('');

  // images
  const [files, setFiles] = useState<PreviewFile[]>([]);
  // use this as the specific ID of the file
  const [mainFileId, setMainFileId] = useState<string>();

  const [step, setStep] = useState(0);

  // TODO: where is a good place to revoke the urls while maintaing a good UX
  // i.e. the user can still see the images when they reverse the step
  // useEffect(
  //   () => () => {
  //     // Make sure to revoke the data uris to avoid memory leaks
  //     files.forEach((file) => URL.revokeObjectURL(file.preview));
  //   },
  //   [files]
  // );

  const onPrevStep = () => setStep(step - 1);

  const onNextStep = () => setStep(step + 1);

  const onSubmitInfoForm = (sneakerStates: ListingFormSneakerStateType, billingInfoInput: string) => {
    onNextStep();

    setSneaker(sneakerStates);
    setBillingInfo(billingInfoInput);
  };

  const onDropFile = (newFiles: PreviewFile[]) => setFiles(newFiles);

  const onRemoveFile = (fileId: string) => {
    if (mainFileId === fileId) setMainFileId(undefined);

    const filesAfterRemoval = files.filter((file) => file.id !== fileId);
    setFiles(filesAfterRemoval);
  };

  const updateFileId = (fileId: string) => setMainFileId(fileId);

  const getMainDisplayFile = () => files.filter((f) => f.id === mainFileId)[0];

  const formDataFromFiles = () => {
    const formData = new FormData();

    // image need to be the first element to be the main display image
    const mainFileIdx = files.findIndex(f => f.id === mainFileId)
    const tmp = files[0]
    files[0] = files[mainFileIdx]
    files[mainFileIdx] = tmp

    for (const f of files) formData.append('files', f);

    return formData;
  };

  // NOTE: am I doing too much in the onFinishSubmit function???

  // steps:
  // upload all the images to S3 -> insert the product in the
  // Products and the ListedProducts table -> display successful message
  const onFinishSubmit = async () => {
    const uploadedUrls = await uploadS3MultipleImages(formDataFromFiles());

    const formattedUrls = uploadedUrls.join(',');
    // need no use the asking price to create the product, because it should be a RRP
    const createSneakerPayload = { ...formatProductSneaker(sneaker), imageUrls: formattedUrls };

    let prodId: number;

    const product = await getProductByNamecolorwaySize(`${sneaker.name} ${sneaker.colorway}`, sneaker.size as number);

    if (product) prodId = product.id!;
    else prodId = await createProduct(createSneakerPayload);

    const currentUser = await getCurrentUser()

    const listedProductPayload = formatListedProduct(sneaker, currentUser.id!, prodId);
    await createListedProduct(listedProductPayload);

    // duplicate primary key insertions are handled by the backend
    await createBrand({ brand: sneaker.brand });
    await createColorway({ colorway: sneaker.colorway });
    await createSneakerName({ name: sneaker.name });

    // Go to the success message
    onNextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm formValues={{ ...sneaker, billingInfo }} onSubmit={onSubmitInfoForm} />;
      case 1:
        return (
          <PreviewImagesDropZone
            {...{ files, mainFileId, onPrevStep, onNextStep, onDropFile, onRemoveFile, updateFileId }}
          />
        );
      case 2:
        const previewSneaker = { ...sneaker, imageUrls: getMainDisplayFile().preview, price: sneaker.askingPrice };
        return <PreviewSneaker {...{ sneaker: previewSneaker, onPrevStep, onSubmit: onFinishSubmit }} />;
      case 3:
        return <SubmissionSuccess />;
      default:
        return undefined;
    }
  };

  const calcProgress = () => ((step + 1) / 4) * 100;

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content' style={{ paddingTop: '2.2rem' }}>
        <Container style={{ maxWidth: step === 2 ? '500px' : undefined }}>
          <Col className='text-center'>
            <p style={{ margin: 0 }}>{calcProgress()}%</p>
            <div style={{ marginBottom: '1rem' }}>
              <Progress value={calcProgress()} />
            </div>
            {renderStep()}
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListingForm;
