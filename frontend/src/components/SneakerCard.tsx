import React from 'react';

import { CardBody, CardHeader, Card } from 'reactstrap';

import { Sneaker } from '../../../shared';


type SneakerCardProps = {
  sneaker: Sneaker;
  maxWidth?: string;
};

const SneakerCard = (props: SneakerCardProps) => {
  const { imageUrls, name, price } = props.sneaker;

  return (
    <Card style={{ maxWidth: props.maxWidth }}>
      <CardHeader style={{ position: 'relative', paddingTop: '58%', margin: '15px' }}>
        <img style={{ position: 'absolute', top: 0, left: 0 }} src={imageUrls} alt={name} />
      </CardHeader>
      <CardBody className='text-left' style={{ padding: '12px' }}>
        <h5>{name}</h5>
        <h3 className='title'>${price}</h3>
      </CardBody>
    </Card>
  );
};

export default SneakerCard;
