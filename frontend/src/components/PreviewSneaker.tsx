import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { Sneaker } from '../../../shared';

type PreviewSneakerProps = {
  sneaker: Sneaker;
  onPrevStep: () => void;
  onSubmit: () => void;
};

const PreviewSneaker = (props: PreviewSneakerProps) => {
  const { sneaker, onPrevStep, onSubmit } = props;

  return (
    <Card className='text-center' style={{ maxWidth: '500px' }}>
      <CardHeader>
        <h5 className='title'>Preview of {sneaker.name.toUpperCase()}</h5>
      </CardHeader>
      <CardBody>
        <SneakerCard sneaker={sneaker} />
      </CardBody>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={onPrevStep}>Previous</Button>
        <Button color='primary' onClick={onSubmit}>
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewSneaker;
