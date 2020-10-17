import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { AppSneaker } from '../../../shared';

type PreviewSneakerProps = {
  sneaker: AppSneaker;
  price: number;
  mainDisplayImage: string | undefined;
  onPrevStep: () => void;
  onSubmit: () => void;
};

const PreviewSneaker = (props: PreviewSneakerProps) => {
  const { sneaker, price, onPrevStep, onSubmit, mainDisplayImage } = props;

  return (
    <Card className='text-center'>
      <CardHeader>
        <h5 className='title'>Preview of {sneaker.name.toUpperCase()}</h5>
      </CardHeader>
      <CardBody>
        <SneakerCard sneaker={sneaker} mainDisplayImage={mainDisplayImage} price={price} />
      </CardBody>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={onPrevStep}>Previous</Button>
        <Button type='button' color='primary' onClick={onSubmit}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewSneaker;
