import React from 'react';
import styled from 'styled-components';
import { Card } from 'reactstrap';

import { Sneaker } from '../../../shared';

type SneakerCardProps = {
  sneaker: Sneaker;
  maxWidth?: string;
};

const ImageContainer = styled.div`
  position: relative;
  padding-top: 75%;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`;

const InfoContainer = styled.div`
  padding: 0px 15px;
  & > * {
    margin-bottom: 5px;
  }
`;

const SneakerName = styled.div`
  font-size: 1.35em;
`;

const SneakerPrice = styled.div`
  font-weight: bold;
  font-size: 1.75em;
`;

const SneakerCard = (props: SneakerCardProps) => {
  const { imageUrls, name, price, brand, size, colorWay } = props.sneaker;
  const firstImageUrl = () => imageUrls.split(',')[0];

  const formatSneakerName = () => [colorWay, brand, name].join(' ');

  return (
    <Card className='text-left' style={{ maxWidth: props.maxWidth }}>
      <ImageContainer>
        <Image src={firstImageUrl()} alt={name} />
      </ImageContainer>
      <InfoContainer>
        <SneakerName>{formatSneakerName()}</SneakerName>
        <SneakerPrice>${price}</SneakerPrice>
        <div className='category' style={{ fontSize: '1.15em' }}>
          Size: {size}
        </div>
      </InfoContainer>
    </Card>
  );
};

export default SneakerCard;
