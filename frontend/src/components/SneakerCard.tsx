import React from 'react';
import styled from 'styled-components';
import { Card } from 'reactstrap';

import { Sneaker } from '../../../shared';
import { useHistory } from 'react-router-dom';
import { formatSneakerPathName } from 'utils/utils';

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
  padding: 0px 6%;
  & > * {
    margin-bottom: 5px;
  }
`;

type SneakerCardProps = {
  sneaker: Sneaker;
  maxWidth?: string;
  // if isListed then clicking on the card will redirect to the buy page
  isListed?: boolean;
  style?: React.CSSProperties;
};

const SneakerCard = (props: SneakerCardProps) => {
  const { sneaker, isListed, maxWidth } = props;
  const { imageUrls, name, price, size, colorWay } = sneaker;

  const history = useHistory();

  const onClick = () => {
    // TODO: use the name of shoes as the route
    // using the hard coded value for now
    if (isListed) history.push(formatSneakerPathName(sneaker.name));
  };

  const firstImageUrl = () => imageUrls.split(',')[0];

  const formatSneakerName = () => [colorWay, name].join(' ');

  return (
    <Card className='text-left' onClick={onClick} style={{ ...props.style, maxWidth, cursor: isListed ? 'pointer' : '' }}>
      <ImageContainer>
        <Image src={firstImageUrl()} alt={name} />
      </ImageContainer>
      <InfoContainer>
        <div style={{ marginBottom: '6px', height: '38px', lineHeight: '1.3', overflow: 'hidden', fontSize: isListed ? '1rem' : '1.55em' }}>{formatSneakerName()}</div>
        <div>
          <div style={{ fontSize: isListed ? '1.275rem' : '1.75em', fontWeight: 'bold' }}>${price}</div>
          <div className='category' style={{ fontSize: isListed ? '0.875rem' : '1.15em' }}>
            Size: {size}
          </div>
        </div>
      </InfoContainer>
    </Card>
  );
};

export default SneakerCard;
