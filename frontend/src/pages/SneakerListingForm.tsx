import React, { useState } from 'react';

import { Col, Container, Progress } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import ListedSneakerSuccess from 'components/ListSneakerSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';
import PreviewImagesDropzone from 'components/PreviewImagesDropzone';

import { SneakerStatus, ListedSneakerFormPayload } from '../../../shared';

import { useAuth } from 'providers/AuthProvider';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneCtxProvider';
import { useSneakerListingFormCtx, SneakerListingFormStateType } from 'providers/SneakerListingFormCtxProvider';

import onListingSneaker from 'usecases/onListingSneaker';
import { mapUpperCaseFirstLetter } from 'utils/utils';

const formatListedSneakerPayload = (
  sneaker: SneakerListingFormStateType,
  quantity?: number
): ListedSneakerFormPayload => ({
  askingPrice: Number(sneaker.askingPrice),
  sizeSystem: sneaker.sizeSystem,
  currencyCode: sneaker.currencyCode,
  prodCondition: sneaker.prodCondition,
  quantity: quantity || 1,
  prodStatus: 'listed' as SneakerStatus,
  conditionRating: sneaker.conditionRating,
  description: sneaker.description,
  serialNumber: '',
});

const formatSneaker = (s: SneakerListingFormStateType) => {
  const name = mapUpperCaseFirstLetter(s.name, ' ');
  const colorway = mapUpperCaseFirstLetter(s.colorway, ' ');
  const brand = mapUpperCaseFirstLetter(s.brand, ' ');

  const size = Number(s.size);

  return { name, colorway, brand, size };
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

    const nameColorway = `${name} ${colorway}`;
    const imgFormData = formDataFromFiles();
    const sneakerPayload = formatSneaker(listingSneakerFormState);
    const listedProductPayload = formatListedSneakerPayload(listingSneakerFormState);

    await onListingSneaker(
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

    // Go to the success message
    goNextstep();

    destroyFiles();
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
        return <ListedSneakerSuccess />;
      default:
        return undefined;
    }
  };

  const calcProgress = () => ((step + 1) / 4) * 100;

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content' style={{ paddingTop: '2.2rem' }}>
        <Container style={{ maxWidth: step === 2 ? '625px' : undefined }}>
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
