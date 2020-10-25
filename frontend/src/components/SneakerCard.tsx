import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card } from 'reactstrap';
import styled from 'styled-components';
import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';
import { AppSneaker } from '../../../shared';

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

type SneakerCardProps = {
  sneaker: Partial<AppSneaker>;
  mainDisplayImage: string | undefined;
  price: number | undefined;
  maxWidth?: string;
  // if isListed then clicking on the card will redirect to the buy page
  isListed?: boolean;
  styles?: React.CSSProperties;
  className?: string;
};

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
`;

const StyledImageContainer = styled.div`
  position: relative;
  padding-bottom: 60.66%;
`;

const SneakerCard = (props: SneakerCardProps) => {
  const history = useHistory();

  const { sneaker, isListed, price, maxWidth, mainDisplayImage } = props;
  const { name, size, colorway } = sneaker;

  const onClick = () => {
    if (isListed && name && colorway) redirectBuySneakerPage(history, name, colorway);
  };

  const displayName = `${name} ${colorway}`

  return (
    <Card
      className={props.className}
      onClick={onClick}
      style={{
        ...props.styles,
        maxWidth,
        cursor: isListed ? 'pointer' : '',
        boxShadow: 'none',
        display: 'flex',
        textAlign: 'left',
      }}
      data-testid={displayName}
    >
      <StyledImageContainer>
        <StyledImage src={mainDisplayImage} />
      </StyledImageContainer>
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
          {displayName}
        </div>
        <div>
          {price !== undefined && (
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
