import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, ListGroup, ListGroupItem } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { Sneaker } from '../../../shared';

type PreviewSneakerProps = {
  sneaker: Sneaker;
  onPrevStep: () => void;
  onSubmit: () => void;
};

type SneakerInfoListGroupProps = {
  sneaker: Sneaker;
};

const SneakerInfoListGroup = (props: SneakerInfoListGroupProps) => {
  const { brand, colorWay, size, description } = props.sneaker;

  return (
    <ListGroup>
      <ListGroupItem>Brand: {brand}</ListGroupItem>
      <ListGroupItem>Color way: {colorWay}</ListGroupItem>
      <ListGroupItem>Size: {size}</ListGroupItem>
      {description && <ListGroupItem>{description}</ListGroupItem>}
    </ListGroup>
  );
};

// % is not allowed in an url, so use it to separate the urls
const firstImgUrl = (urls: string) => urls.split('%')[0]

const PreviewSneaker = (props: PreviewSneakerProps) => {
  const { sneaker, onPrevStep, onSubmit } = props;

  return (
    <Card className='text-center' style={{ maxWidth: '365px' }}>
      <CardHeader>
        <h5 className='title'>Preview of {sneaker.name.toUpperCase()}</h5>
      </CardHeader>
      {/* TODO: the image url should be dynamic */}
      <CardBody>
        <SneakerCard sneaker={{ ...sneaker, imageUrls: firstImgUrl(sneaker.imageUrls) }} />
        <SneakerInfoListGroup sneaker={sneaker} />
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
