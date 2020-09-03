import React, { useState } from 'react';

import styled from 'styled-components';
import { Container, Button, Row, Col } from 'reactstrap';

import SneakerCard from 'components/SneakerCard';
import { Sneaker, UserSizeGroupedPriceType } from '../../../shared';
import SneakerCardProps from '__tests__/data/SneakerCardProps';

const CenterContainer = styled(Container)`
  text-align: center;
`;

const mockSneakerMerchs: UserSizeGroupedPriceType = {
  1.5: { 2: 100, 4: 500, lowestAsk: 100 },
  3: { 2: 200, 4: 150, lowestAsk: 150 },
  5: { 2: 100, 4: 500, lowestAsk: 100 },
  9: { 10: 400, lowestAsk: 400 },
};

const GridTile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  width: 22%;
  height: 70px;
  margin: 4px;
`;

const InnerTile = styled.div`
  background: #fff;
  border: 1px solid #e5e7ea;
  text-align: center;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 70px;
`;

const ShoeSize = styled.div`
  color: #000;
  font-weight: 700;
`;

const ShoePrice = styled.div`
  color: #08a05c;
`;

const colorAndNameFromPath = () => {
  const { pathname } = window.location;

  const pathArray = pathname.split('/');
  const shoeName = pathArray[pathArray.length - 1].split('-').join(' ');

  return shoeName;
};

// use the path name to query the sneaker
const BuySneakerPage = () => {
  delete SneakerCardProps.size

  const [defaultSneaker, setDefaultSneaker] = useState<Sneaker>(SneakerCardProps);
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>(SneakerCardProps);
  const [selectedIdx, setSelectedIdx] = useState<number>();

  const onClick = (idx: number, price: number, size: number) => {
    if (selectedIdx === idx) {
      setSelectedIdx(undefined);
      setDisplaySneaker(defaultSneaker);
    } else {
      setSelectedIdx(idx);
      setDisplaySneaker({ ...displaySneaker, price, size });
    }
  };

  const shoeName = colorAndNameFromPath();

  const SizesGrid = () => {
    const renderTiles = () =>
      Object.keys(mockSneakerMerchs).map((shoeSize, idx) => {
        const size = Number(shoeSize);

        return (
          <GridTile onClick={() => onClick(idx, mockSneakerMerchs[size].lowestAsk, size)} key={idx}>
            <InnerTile style={{ border: selectedIdx === idx ? '2px solid green' : '' }}>
              <ShoeSize>US {shoeSize}</ShoeSize>
              <ShoePrice>${mockSneakerMerchs[size].lowestAsk}</ShoePrice>
            </InnerTile>
          </GridTile>
        );
      });

    return (
      <Container>
        <Row>{renderTiles()}</Row>
      </Container>
    );
  };

  return (
    <Row style={{ minHeight: 'calc(95vh - 96px)' }}>
      <Col md='6'>
        <SizesGrid />
      </Col>
      <Col md='6'>
        <CenterContainer>
          <SneakerCard sneaker={displaySneaker} maxWidth='400px' style={{ padding: '25px' }} />
          {/* TODO: implement the logic for checkout */}
          <Button disabled={selectedIdx === undefined} style={{ display: 'block', margin: 'auto' }} color='primary' onClick={() => console.log('BUY ME!')}>
            Buy
          </Button>
        </CenterContainer>
      </Col>
    </Row>
  );
};

export default BuySneakerPage;
