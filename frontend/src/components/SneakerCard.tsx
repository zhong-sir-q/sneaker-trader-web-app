import React from 'react';
import styled from 'styled-components';

import { AppSneaker } from '../../../shared';
import LazyLoad from 'react-lazyload';

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

const StyledCard = styled.div`
  text-align: left;
`;

type InfoProps = { isListed: boolean | undefined };

const MainText = styled.div<InfoProps>`
  margin-bottom: 4px;
  line-height: 1.3;
  font-size: ${({ isListed }) => (isListed ? '16px' : '1.55em')};
`;

const Price = styled.div<InfoProps>`
  line-height: 1.3;
  font-size: ${({ isListed }) => (isListed ? '18px' : '1.75em')};
  white-space: nowrap;
  font-weight: 700;
`;

type SneakerCardProps = {
  sneaker: Partial<AppSneaker>;
  mainDisplayImage: string;
  price: number | undefined;
  maxWidth?: string;
  // if isListed then clicking on the card will redirect to the buy page
  isListed?: boolean;
  styles?: React.CSSProperties;
  className?: string;
  lazyLoad?: boolean;
  onClick?: () => void;
};

const SneakerCard = (props: SneakerCardProps) => {
  const { sneaker, isListed, price, maxWidth, mainDisplayImage, onClick } = props;
  const { name, size, colorway } = sneaker;

  const displayName = `${name} ${colorway}`;

  return (
    <StyledCard
      className={props.className}
      onClick={onClick}
      style={{
        ...props.styles,
        maxWidth,
        cursor: isListed ? 'pointer' : '',
      }}
      data-testid={displayName}
    >
      {props.lazyLoad ? (
        <LazyLoad>
          <img className='w-full' src={mainDisplayImage} alt={displayName} />
        </LazyLoad>
      ) : (
        <img className='w-full' src={mainDisplayImage} alt={displayName} />
      )}
      <InfoContainer>
        <MainText isListed={isListed}>{name}</MainText>
        <MainText isListed={isListed}>{colorway}</MainText>
        <div>
          {price !== undefined && (
            <React.Fragment>
              <LowestAsk>Lowest Ask</LowestAsk>
              <Price isListed={isListed}>${price}</Price>
            </React.Fragment>
          )}
          {size && (
            <div className='category' style={{ fontSize: isListed ? '14px' : '1.15em', lineHeight: '1.3' }}>
              Size: {size}
            </div>
          )}
        </div>
      </InfoContainer>
    </StyledCard>
  );
};

export default SneakerCard;
