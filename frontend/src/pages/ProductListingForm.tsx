import React, { useState } from 'react';

import { Col, Container, Progress } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SubmissionSuccess from 'components/SubmissionSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';
import PreviewImagesDropzone from 'components/PreviewImagesDropzone';

import {
  createProduct,
  uploadS3MultipleImages,
  createListedProduct,
  createBrand,
  createSneakerName,
  createColorway,
  getProductByNameColorwaySize,
} from 'api/api';

import { Sneaker, ListedProduct, SneakerCondition } from '../../../shared';

import { useAuth } from 'providers/AuthProvider';
import PreviewImgDropzoneCtxProvider from 'providers/PreviewImgDropzoneCtxProvider';

export type ListingFormSneakerStateType = Omit<Sneaker, 'imageUrls' | 'price'> &
  Pick<ListedProduct, 'sizeSystem' | 'currencyCode' | 'prodCondition' | 'askingPrice' | 'conditionRating'>;

const INIT_SNEAKER_FORM_STATE: ListingFormSneakerStateType = {
  name: '',
  brand: '',
  size: '',
  colorway: '',
  askingPrice: '',
  description: '',
  sizeSystem: '',
  currencyCode: '',
  prodCondition: '' as SneakerCondition,
  conditionRating: 10,
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
  prodStatus: 'listed',
  conditionRating: sneaker.conditionRating,
});

const formatProductSneaker = (s: ListingFormSneakerStateType): Omit<Sneaker, 'imageUrls' | 'price'> => {
  const { name, colorway, brand, size, description } = s;

  return { name, colorway, brand, size, description };
};

// A 4-step form, first to submit the basic info, second to preview with the
// option to go back and change, third to confirm and upload the product. Lastly
// prompt the success message to the user

const ProductListingForm = () => {
  const [sneaker, setSneaker] = useState(INIT_SNEAKER_FORM_STATE);
  // not part of the sneaker, so separate the state out
  const [billingInfo, setBillingInfo] = useState('');

  const [step, setStep] = useState(0);

  const { currentUser } = useAuth();

  const goPrevStep = () => setStep(step - 1);

  const goNextstep = () => setStep(step + 1);

  const onSubmitInfoForm = (sneakerStates: ListingFormSneakerStateType, billingInfoInput: string) => {
    goNextstep();

    setSneaker(sneakerStates);
    setBillingInfo(billingInfoInput);
  };

  const [previewImgUrl, setPreviewImgUrl] = useState('');
  const [imgUrlsFormData, setImgUrlsFormData] = useState<FormData>();

  const onConfirmPreview = (previewUrl: string, formData: FormData) => {
    setPreviewImgUrl(previewUrl);
    setImgUrlsFormData(formData);
    goNextstep();
  };

  // steps:
  // upload all the images to S3 -> insert the product in the
  // Products and the ({ ...new File(), id: '', preview: '' })ListedProducts table -> display successful message
  const onFinishSubmit = async () => {
    const uploadedUrls = await uploadS3MultipleImages(imgUrlsFormData!);

    const formattedUrls = uploadedUrls.join(',');
    // need no use the asking price to create the product, because it should be a RRP
    const createSneakerPayload = { ...formatProductSneaker(sneaker), imageUrls: formattedUrls };

    let prodId: number;

    const product = await getProductByNameColorwaySize(`${sneaker.name} ${sneaker.colorway}`, sneaker.size as number);

    if (product) prodId = product.id!;
    else prodId = await createProduct(createSneakerPayload);

    const listedProductPayload = formatListedProduct(sneaker, currentUser!.id!, prodId);
    await createListedProduct(listedProductPayload);

    // duplicate primary key insertions are handled by the backend
    await createBrand({ brand: sneaker.brand });
    await createColorway({ colorway: sneaker.colorway });
    await createSneakerName({ name: sneaker.name });

    // Go to the success message
    goNextstep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm formValues={{ ...sneaker, billingInfo }} onSubmit={onSubmitInfoForm} />;
      case 1:
        return <PreviewImagesDropzone onNextStep={onConfirmPreview} onPrevStep={goPrevStep} />;
      case 2:
        const previewSneaker = { ...sneaker, imageUrls: previewImgUrl, price: sneaker.askingPrice };
        return <PreviewSneaker {...{ sneaker: previewSneaker, onPrevStep: goPrevStep, onSubmit: onFinishSubmit }} />;
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
            <PreviewImgDropzoneCtxProvider>{renderStep()}</PreviewImgDropzoneCtxProvider>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListingForm;
