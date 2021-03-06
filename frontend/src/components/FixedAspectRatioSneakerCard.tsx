import React from 'react';
import { AppSneaker } from '../../../shared';
import styled from 'styled-components';

import LazyBackgroundImg from './img/LazyBackgroundImg';
import BackgroundImg from './img/BackgroundImg';

const InfoContainer = styled.div`
  padding: 5%;
  background-color: rgb(250, 250, 250);
  /* the container has border-radius of 8px */
  border-radius: 8px;

  & > * {
    margin-bottom: 3px;
  }
`;

const LowestAsk = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  color: rgba(0, 0, 0, 0.5);
  text-transform: capitalize;
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

type SizeTextProps = {
  isListed: boolean | undefined;
};

const SizeText = styled.div<SizeTextProps>`
  font-size: ${({ isListed }) => (isListed ? '14px' : '1.15em')};
  line-height: 1.3;
`;

type FixedAspectRatioSneakerCardProps = {
  sneaker: Partial<AppSneaker>;
  mainDisplayImage: string;
  price: number | undefined;
  ratio?: string;
  // if isListed then clicking on the card will redirect to the buy page
  isListed?: boolean;
  onClick?: () => void;
};

const FixedAspectRatioSneakerCard = (props: FixedAspectRatioSneakerCardProps) => {
  const { sneaker, ratio, isListed, price, mainDisplayImage, onClick } = props;
  const { name, size, colorway } = sneaker;

  return (
    <CardV2 onClick={onClick}>
      <LazyBackgroundImg
        ratio={ratio}
        background={mainDisplayImage}
        placeholder=''
        BackgroundImgElement={BackgroundImg}
      />
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
            <SizeText className='category' isListed={isListed}>
              Size: {size}
            </SizeText>
          )}
        </div>
      </InfoContainer>
    </CardV2>
  );
};

const CardV2 = styled.div`
  cursor: pointer;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  text-align: left;
  height: 100%;
`;

export default FixedAspectRatioSneakerCard;
