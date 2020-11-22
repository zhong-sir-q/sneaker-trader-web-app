import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { AppSneaker } from '../../../shared';
import CenterSpinner from './CenterSpinner';

type PreviewSneakerProps = {
  sneaker: AppSneaker;
  price: number;
  mainDisplayImage: string | undefined;
  onPrevStep: () => void;
  onSubmit: () => void;
  aspectRatio?: string;
};

const PreviewSneaker = (props: PreviewSneakerProps) => {
  const { aspectRatio, sneaker, price, onPrevStep, onSubmit, mainDisplayImage } = props;

  const [isSubmitDisabled, setSubmitDisabled] = useState(false);

  const handleSubmit = () => {
    setSubmitDisabled(!isSubmitDisabled);
    onSubmit();
  };

  return isSubmitDisabled ? (
    <CenterSpinner />
  ) : (
    <Card className='text-center'>
      <CardHeader data-testid='preview-sneaker-card-header'>
        <h5 className='title'>Preview of {sneaker.name.toUpperCase()}</h5>
      </CardHeader>
      <CardBody data-testid='preview-sneaker-card-body'>
        <SneakerCard aspectRatio={aspectRatio} sneaker={sneaker} mainDisplayImage={mainDisplayImage} price={price} />
      </CardBody>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={onPrevStep}>Previous</Button>
        <Button type='button' color='primary' onClick={handleSubmit} disabled={isSubmitDisabled}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewSneaker;
