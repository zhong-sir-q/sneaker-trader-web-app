import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, Progress, Button } from 'reactstrap';

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
import { useSneakerListingFormCtx, INIT_LISTING_FORM_STATE_VALUES } from 'providers/SneakerListingFormProvider';

import { ADMIN, TOPUP_WALLET } from 'routes';

import checkUserWalletBalance from 'usecases/checkUserWalletBalance';
import onListingSneaker from 'usecases/onListingSneaker';

import { formatListedSneakerPayload, formatSneaker, getMainDisplayImgUrl } from 'utils/utils';
import SneakerSearchBar from 'components/SneakerSearchBar';
import { SearchBarSneaker } from '../../../shared';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import AlertDialog from 'components/AlertDialog';
import styled from 'styled-components';

// this prop is for testing purposes, so we can start from any step we want
type SneakerListingFormProps = {
  step?: number;
};

// the providers reside in routes.tsx
const SneakerListingForm = (props: SneakerListingFormProps) => {
  const [step, setStep] = useState(props.step || 0);
  // see if the sneaker is already in the suggestion list
  const [isSneakerNew, setIsSneakerNew] = useState(false);

  const negativeBalanceAlertHook = useOpenCloseComp();

  const setSnekaerNew = () => setIsSneakerNew(true);
  const setSneakerExists = () => setIsSneakerNew(false);

  const [listedSneakers, setListedSneakers] = useState<
    { name: string; colorway: string; brand: string; mainDisplayImage: string }[]
  >([]);

  // use this state to get the one from the sneaker search bar
  const [searchBarInputVal, setSearchBarInputVal] = useState('');
  const updateSearchBarInputVal = (val: string) => setSearchBarInputVal(val);

  const { currentUser } = useAuth();

  const history = useHistory();

  const { updateFormState } = useSneakerListingFormCtx();

  useEffect(() => {
    if (!currentUser) return;

    const goTopupWalletIfNegativeWalletBalance = async () => {
      const isWalletBalancePositive = await checkUserWalletBalance(WalletControllerInstance, currentUser.id);

      if (!isWalletBalancePositive) negativeBalanceAlertHook.onOpen();
    };

    goTopupWalletIfNegativeWalletBalance();
  }, [currentUser, history, negativeBalanceAlertHook]);

  const onCloseNegWalletBalanceAlert = () => {
    negativeBalanceAlertHook.onClose();
    history.push(ADMIN + TOPUP_WALLET);
  };

  useEffect(() => {
    (async () => {
      const sneakers = await ListedSneakerControllerInstance.getAll();
      const imgUrlsToMainDisplayImage = sneakers.map((s) => ({
        ...s,
        mainDisplayImage: getMainDisplayImgUrl(s.imageUrls),
      }));

      setListedSneakers(imgUrlsToMainDisplayImage);
    })();
  }, []);

  const { formDataFromFiles, mainDisplayFileDataUrl, destroyFiles } = usePreviewImgDropzoneCtx();
  const { brandOptions, colorwayOptions, sneakerNamesOptions, listingSneakerFormState } = useSneakerListingFormCtx();

  const goPrevStep = () => {
    if (step === 0) return;
    setStep(step - 1);
  };
  const goNextstep = () => setStep(step + 1);

  const onFinishSubmit = async () => {
    const { name, colorway, brand } = listingSneakerFormState;

    const imgFormData = formDataFromFiles();
    const sneakerPayload = formatSneaker(listingSneakerFormState);
    const createListedProductPayload = formatListedSneakerPayload(
      listingSneakerFormState,
      isSneakerNew ? 'new sneaker request' : 'listed'
    );

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

  const onChooseSearchBarSneaker = (sneaker: SearchBarSneaker) => {
    updateFormState({
      ...INIT_LISTING_FORM_STATE_VALUES,
      ...sneaker,
    });

    goNextstep();
  };

  const onRequestNewSneaker = (searchVal: string) => {
    updateFormState({
      ...INIT_LISTING_FORM_STATE_VALUES,
      name: searchVal,
    });

    goNextstep();
  };

  const successTitle = isSneakerNew
    ? 'Thank you, we will review your new sneaker request shortly.'
    : 'Congratulations, you successfully listed the sneakers!';

  const STEPS = 5;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            <SneakerSearchBar
              sneakers={listedSneakers}
              onChooseSneaker={onChooseSearchBarSneaker}
              setSneakerNew={setSnekaerNew}
              setSneakerExists={setSneakerExists}
              updateSearchVal={updateSearchBarInputVal}
              suggestionMaxHeight='55vh'
            />
            {isSneakerNew ? (
              <Button color='primary' onClick={() => onRequestNewSneaker(searchBarInputVal)}>
                Request a new listing
              </Button>
            ) : null}
          </React.Fragment>
        );
      case 1:
        return <SneakerInfoForm title='Sneaker Listing Form' goNextStep={goNextstep} goPrevStep={goPrevStep} />;
      case 2:
        return <PreviewImagesDropzone onNextStep={goNextstep} onPrevStep={goPrevStep} />;
      case 3:
        if (!mainDisplayFileDataUrl) return null;

        return (
          <PreviewSneaker
            sneaker={formatSneaker(listingSneakerFormState)}
            mainDisplayImage={mainDisplayFileDataUrl}
            price={Number(listingSneakerFormState.askingPrice)}
            onPrevStep={goPrevStep}
            onSubmit={onFinishSubmit}
            ratio='66.6%'
          />
        );
      case 4:
        return <ListedSneakerSuccess className='text-center' title={successTitle} />;
      default:
        return null;
    }
  };

  // STEPS - 1 because the last step is a success message
  const calcProgress = () => ((step + 1) / (STEPS - 1)) * 100;

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content' style={{ paddingTop: '2.2rem' }}>
        <StepContainer>
          <Col>
            {step < 4 && (
              <StepIndicator>
                Step {step + 1} of {STEPS - 1}
              </StepIndicator>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <Progress value={calcProgress()} />
            </div>
            {renderStep()}
          </Col>
        </StepContainer>
      </div>
      <AlertDialog
        color='info'
        message='Please topup first, your wallet balance must be greater than 0'
        open={negativeBalanceAlertHook.open}
        onClose={onCloseNegWalletBalanceAlert}
        maxWidth='sm'
      />
    </React.Fragment>
  );
};

const StepIndicator = styled.div`
  text-align: center;
  font-size: 1.75rem;
`;

const StepContainer = styled.div`
  margin: auto;
  width: 50%;

  @media (max-width: 1536px) {
    width: 70%;
  }

  @media (max-width: 768px) {
    width: 92.5%;
  }
`;

export default SneakerListingForm;
