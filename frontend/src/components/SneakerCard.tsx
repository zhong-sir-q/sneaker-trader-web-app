import React from 'react';
import styled from 'styled-components';
import { Card } from 'reactstrap';

import { Sneaker } from '../../../shared';
import { useHistory } from 'react-router-dom';
import { formatSneakerPathName } from 'utils/utils';

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
  styles?: React.CSSProperties
};

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

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
    <Card onClick={onClick} style={{ ...props.styles, maxWidth, cursor: isListed ? 'pointer' : '', boxShadow: 'none', display: 'flex' }}>
      <StyledImage src={firstImageUrl()} />
      <InfoContainer>
        <div
          style={{
            marginBottom: '4px',
            height: '38px',
            lineHeight: '1.3',
            overflow: 'hidden',
            fontSize: isListed ? '16px' : '1.55em',
          }}
        >
          {formatSneakerName()}
        </div>
        <div>
          {price && (
            <React.Fragment>
              <LowestAsk>Lowest Ask</LowestAsk>
              <div
                style={{
                  fontSize: isListed ? '18px' : '1.75em',
                  lineHeight: '1.3',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                ${price}
              </div>
            </React.Fragment>
          )}
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
