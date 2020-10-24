import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, Container, Progress } from 'reactstrap';

import AwsControllerInstance from 'api/controllers/AwsController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import WalletControllerInstance from 'api/controllers/WalletController';

import ListedSneakerSuccess from 'components/ListSneakerSuccess';
import PanelHeader from 'components/PanelHeader';
import PreviewImagesDropzone from 'components/PreviewImagesDropzone';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';

import { useAuth } from 'providers/AuthProvider';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';
import { SneakerListingFormStateType, useSneakerListingFormCtx } from 'providers/SneakerListingFormProvider';

import { ADMIN, TOPUP_WALLET } from 'routes';

import checkUserWalletBalance from 'usecases/checkUserWalletBalance';
import onListingSneaker from 'usecases/onListingSneaker';

import { mapUpperCaseFirstLetter } from 'utils/utils';

import { ListedSneakerFormPayload, SneakerStatus } from '../../../shared';

const formatListedSneakerPayload = (sneaker: SneakerListingFormStateType, quantity?: number) => (
  s3UploadedUrls: string[]
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
  originalPurchasePrice: Number(sneaker.originalPurchasePrice),
  mainDisplayImage: s3UploadedUrls[0],
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
  const history = useHistory();

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const goTopupWalletIfNegativeWalletBalance = async () => {
      const isWalletBalancePositive = await checkUserWalletBalance(WalletControllerInstance, currentUser.id);

      if (!isWalletBalancePositive) {
        history.push(ADMIN + TOPUP_WALLET);
        alert('Please topup first, your wallet balance must be greater than 0');
      }
    };

    goTopupWalletIfNegativeWalletBalance();
  });

  const { formDataFromFiles, getMainDisplayFile, destroyFiles } = usePreviewImgDropzoneCtx();
  const { brandOptions, colorwayOptions, sneakerNamesOptions, listingSneakerFormState } = useSneakerListingFormCtx();

  const goPrevStep = () => setStep(step - 1);
  const goNextstep = () => setStep(step + 1);

  const onFinishSubmit = async () => {
    const { name, colorway, brand } = listingSneakerFormState;

    const imgFormData = formDataFromFiles();
    const sneakerPayload = formatSneaker(listingSneakerFormState);
    const createListedProductPayload = formatListedSneakerPayload(listingSneakerFormState);

    await onListingSneaker(
      AwsControllerInstance,
      SneakerControllerInstance,
      ListedSneakerControllerInstance,
      HelperInfoControllerInstance
    )(
      imgFormData,
      currentUser!.id!,
      sneakerPayload,
      createListedProductPayload,
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
          // although plural, but preview is always a single url
          imageUrls: getMainDisplayFile()!.preview,
        };

        return (
          <PreviewSneaker
            sneaker={previewSneaker}
            mainDisplayImage={previewSneaker.imageUrls}
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
