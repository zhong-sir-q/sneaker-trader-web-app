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

import { Sneaker, ListedProduct } from '../../../shared';

import { useAuth } from 'providers/AuthProvider';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneCtxProvider';
import { useSneakerListingFormCtx, SneakerListingFormStateType } from 'providers/SneakerListingFormCtxProvider';

const formatListedProduct = (
  sneaker: SneakerListingFormStateType,
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

const formatProductSneaker = (s: SneakerListingFormStateType): Omit<Sneaker, 'imageUrls' | 'price'> => {
  const { name, colorway, brand, size, description } = s;

  return { name, colorway, brand, size, description };
};

// the providers reside in routes.tsx
const ProductListingForm = () => {
  const [step, setStep] = useState(0);

  const { currentUser } = useAuth();
  const { formDataFromFiles, getMainDisplayFile, destroyFiles } = usePreviewImgDropzoneCtx();
  const { brandOptions, colorwayOptions, sneakerNamesOptions, listingSneakerFormState } = useSneakerListingFormCtx();

  const goPrevStep = () => setStep(step - 1);

  const goNextstep = () => setStep(step + 1);

  const onFinishSubmit = async () => {
    const { name, colorway, size, brand } = listingSneakerFormState;

    const uploadedUrls = await uploadS3MultipleImages(formDataFromFiles());

    let prodId: number;

    const product = await getProductByNameColorwaySize(`${name} ${colorway}`, size as number);

    if (product) prodId = product.id!;
    else {
      const formattedUrls = uploadedUrls.join(',');
      const createSneakerPayload = { ...formatProductSneaker(listingSneakerFormState), imageUrls: formattedUrls };

      prodId = await createProduct(createSneakerPayload);
    }

    const listedProductPayload = formatListedProduct(listingSneakerFormState, currentUser!.id!, prodId);
    await createListedProduct(listedProductPayload);

    if (!brandOptions.includes(brand)) await createBrand({ brand });
    if (!colorwayOptions.includes(colorway)) await createColorway({ colorway });
    if (!sneakerNamesOptions.includes(name)) await createSneakerName({ name });

    destroyFiles();

    // Go to the success message
    goNextstep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm goNextStep={goNextstep} />;
      case 1:
        return <PreviewImagesDropzone onNextStep={goNextstep} onPrevStep={goPrevStep} />;
      case 2:
        const previewSneaker = {
          ...listingSneakerFormState,
          imageUrls: getMainDisplayFile()!.preview,
          price: listingSneakerFormState.askingPrice,
        };
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
            {renderStep()}
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListingForm;
