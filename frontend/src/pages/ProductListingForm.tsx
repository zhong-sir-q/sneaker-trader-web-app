import React, { useState } from 'react';

import { Col, Container } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SubmissionSuccess from 'components/SubmissionSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';

import { createProduct } from 'api/api';

import { Sneaker } from '../../../shared';

import aj12Retro from 'assets/img/aj12_retro.jpg';

const INIT_SNEAKER_STATE: Sneaker = {
  name: '',
  brand: '',
  size: Number.NaN,
  colorWay: '',
  price: Number.NaN,
  description: '',
  // TODO: this should be an empty string, change the hard coded value later
  imageUrls: aj12Retro,
};

// A 4-step form, first to submit the basic info, second to preview with the
// option to go back and change, third to confirm and upload the product. Lastly
// prompt the success message to the user

const ProductListingForm = () => {
  const [sneaker, setSneaker] = useState(INIT_SNEAKER_STATE);
  // not part of the sneaker, so separate the state out
  const [billingInfo, setBillingInfo] = useState('');
  const [step, setStep] = useState(0);

  const onPrevStep = () => setStep(step - 1);
  const onNextStep = () => setStep(step + 1);

  const onStepSubmit = (sneakerStates: Sneaker, billingInfoInput: string) => {
    onNextStep();
    setSneaker(sneakerStates);
    setBillingInfo(billingInfoInput);
  };

  // steps: create the product in the backend -> display
  // successful message -> redirect to the homepage
  const onFinishSubmit = async () => {
    const product = await createProduct(sneaker).catch((err) => console.log(err));

    // handle db create product error
    if (!product) return;

    onNextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm formValues={{ ...sneaker, billingInfo }} onSubmit={onStepSubmit} />;
      case 1:
        return <PreviewSneaker {...{ sneaker, onPrevStep, onSubmit: onFinishSubmit }} />;
      case 2:
        return <SubmissionSuccess />;
      default:
        return undefined;
    }
  };

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Container>
          <Col className='text-center'>{renderStep()}</Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListingForm;
