import React from 'react';
import styled from 'styled-components';
import { Card } from 'reactstrap';

import { Sneaker } from '../../../shared';
import { useHistory } from 'react-router-dom';
import { formatSneakerPathName } from 'utils/utils';

const ImageContainer = styled.div`
  position: relative;
  padding-top: 68%;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`;

const InfoContainer = styled.div`
  padding: 5%;
  background-color: rgb(250, 250, 250);
  & > * {
    margin-bottom: 5px;
  }
`;

const LowestAsk = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  color: rgba(0, 0, 0, 0.5);
  text-transform: capitalize;
`;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type SneakerCardProps = {
  sneaker: PartialBy<Sneaker, 'size'>;
  maxWidth?: string;
  // if isListed then clicking on the card will redirect to the buy page
  isListed?: boolean;
};

const SneakerCard = (props: SneakerCardProps) => {
  const { sneaker, isListed, maxWidth } = props;
  const { imageUrls, name, price, size, colorway } = sneaker;

  const history = useHistory();

  const onClick = () => {
    if (isListed) history.push(formatSneakerPathName(name, colorway), sneaker);
  };

  const firstImageUrl = () => imageUrls!.split(',')[0];

  const formatSneakerName = () => [name, colorway].join(' ');

  return (
    <Card
      className='text-left'
      onClick={onClick}
      style={{ maxWidth, cursor: isListed ? 'pointer' : '', boxShadow: 'none' }}
    >
      <ImageContainer>
        <Image src={firstImageUrl()} alt={name} />
      </ImageContainer>
      <InfoContainer>
        <div style={{ marginBottom: '4px', height: '38px', lineHeight: '1.3', overflow: 'hidden', fontSize: isListed ? '16px' : '1.55em' }}>
          {formatSneakerName()}
        </div>
        <div>
          <LowestAsk>Lowest Ask</LowestAsk>
          <div style={{ fontSize: isListed ? '18px' : '1.75em', lineHeight: '1.3', fontWeight: 700, whiteSpace: 'nowrap' }}>${price}</div>
          {size && (
            <div className='category' style={{ fontSize: isListed ? '14px' : '1.15em', lineHeight: '1.3' }}>
              Size: {size}
            </div>
          )}
        </div>
      </InfoContainer>
    </Card>
  );
};

export default SneakerCard;
