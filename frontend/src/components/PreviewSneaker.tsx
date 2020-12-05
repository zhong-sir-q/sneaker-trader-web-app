import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { AppSneaker } from '../../../shared';

type PreviewSneakerProps = {
  sneaker: Omit<AppSneaker, 'imageUrls'>;
  price: number;
  mainDisplayImage: string;
  onSubmit: () => void;
  onPrevStep?: () => void;
};

const PreviewSneaker = (props: PreviewSneakerProps) => {
  const { sneaker, price, onPrevStep, onSubmit, mainDisplayImage } = props;

  const [isSubmitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    if (isSubmitDisabled)
      setTimeout(() => {
        setSubmitDisabled(false);
      }, 2000);
  }, [isSubmitDisabled]);

  const handleSubmit = () => {
    setSubmitDisabled(true);
    onSubmit();
  };

  return (
    <Card className='text-center'>
      <CardHeader data-testid='preview-sneaker-card-header'>
        <h5 className='title'>Preview of {sneaker.name.toUpperCase()}</h5>
      </CardHeader>
      <CardBody data-testid='preview-sneaker-card-body'>
        <SneakerCard sneaker={sneaker} mainDisplayImage={mainDisplayImage} price={price} />
      </CardBody>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
        {onPrevStep && <Button onClick={onPrevStep}>Previous</Button>}
        <Button type='button' color='primary' onClick={handleSubmit} disabled={isSubmitDisabled}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewSneaker;
