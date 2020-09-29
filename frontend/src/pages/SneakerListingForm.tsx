import React, { useState } from 'react';

import { Col, Container, Progress } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SubmissionSuccess from 'components/SubmissionSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';
import PreviewImagesDropzone from 'components/PreviewImagesDropzone';

import { SneakerStatus } from '../../../shared';

import { useAuth } from 'providers/AuthProvider';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneCtxProvider';
import { useSneakerListingFormCtx, SneakerListingFormStateType } from 'providers/SneakerListingFormCtxProvider';

import handleListingSneaker from 'usecases/handleListingSneaker';

const formatListedProduct = (sneaker: SneakerListingFormStateType, quantity?: number) => ({
  askingPrice: Number(sneaker.askingPrice),
  sizeSystem: sneaker.sizeSystem,
  currencyCode: sneaker.currencyCode,
  prodCondition: sneaker.prodCondition,
  quantity: quantity || 1,
  prodStatus: 'listed' as SneakerStatus,
  conditionRating: sneaker.conditionRating
});

const formatSneaker = (s: SneakerListingFormStateType) => {
  const { name, colorway, brand, size, description } = s;

  return { name, colorway, brand, size: Number(size), description };
};

// the providers reside in routes.tsx
const SneakerListingForm = () => {
  const [step, setStep] = useState(0);

  const { currentUser } = useAuth();
  const { formDataFromFiles, getMainDisplayFile, destroyFiles } = usePreviewImgDropzoneCtx();
  const { brandOptions, colorwayOptions, sneakerNamesOptions, listingSneakerFormState } = useSneakerListingFormCtx();

  const goPrevStep = () => setStep(step - 1);

  const goNextstep = () => setStep(step + 1);

  const onFinishSubmit = async () => {
    const { name, colorway, size, brand } = listingSneakerFormState;

    try {
      const nameColorway = `${name} ${colorway}`;
      const imgFormData = formDataFromFiles();
      const sneakerPayload = formatSneaker(listingSneakerFormState);
      const listedProductPayload = formatListedProduct(listingSneakerFormState);

      await handleListingSneaker(
        imgFormData,
        nameColorway,
        size as number,
        currentUser!.id!,
        sneakerPayload,
        listedProductPayload,
        !brandOptions.includes(brand) ? brand : undefined,
        !colorwayOptions.includes(colorway) ? colorway : undefined,
        !sneakerNamesOptions.includes(name) ? name : undefined
      );

      destroyFiles();

      // Go to the success message
      goNextstep();
    } catch {}
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm goNextStep={goNextstep} />;
      case 1:
        return <PreviewImagesDropzone onNextStep={goNextstep} onPrevStep={goPrevStep} />;
      case 2:
        const previewSneaker = {
          ...formatSneaker(listingSneakerFormState),
          imageUrls: getMainDisplayFile()!.preview,
        };

        return (
          <PreviewSneaker
            sneaker={previewSneaker}
            price={Number(listingSneakerFormState.askingPrice)}
            onPrevStep={goPrevStep}
            onSubmit={onFinishSubmit}
          />
        );
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

export default SneakerListingForm;
