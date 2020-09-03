import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { Container, Button, Row, Col, Spinner } from 'reactstrap';

import SneakerCard from 'components/SneakerCard';
import { Sneaker, UserSizeGroupedPriceType } from '../../../shared';
import { getUserSizeGroupedPrice } from 'api/api';

const CenterContainer = styled(Container)`
  text-align: center;
`;

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
  const [selectedIdx, setSelectedIdx] = useState<number>();
  const [defaultSneaker, setDefaultSneaker] = useState<Sneaker>();
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  const [userSizeGroupedPrice, setUserSizeGroupedPrice] = useState<UserSizeGroupedPriceType>();

  const onComponentMounted = async () => {
    const shoeName = colorAndNameFromPath();
    const { payload, ...sneaker } = await getUserSizeGroupedPrice(shoeName);

    // no size is selected initially
    delete sneaker.size;

    setDefaultSneaker(sneaker);
    setDisplaySneaker(sneaker);
    setUserSizeGroupedPrice(payload);
  };

  useEffect(() => {
    onComponentMounted();
  }, []);

  const onClick = (idx: number, price: number, size: number) => {
    if (selectedIdx === idx) {
      setSelectedIdx(undefined);
      setDisplaySneaker(defaultSneaker);
    } else {
      setSelectedIdx(idx);
      setDisplaySneaker({ ...displaySneaker!, price, size });
    }
  };

  const SizesGrid = () => {
    const renderTiles = () =>
      userSizeGroupedPrice &&
      Object.keys(userSizeGroupedPrice).map((shoeSize, idx) => {
        const size = Number(shoeSize);

        return (
          <GridTile onClick={() => onClick(idx, userSizeGroupedPrice[size].lowestAsk, size)} key={idx}>
            <InnerTile style={{ border: selectedIdx === idx ? '2px solid green' : '' }}>
              <ShoeSize>US {shoeSize}</ShoeSize>
              <ShoePrice>${userSizeGroupedPrice[size].lowestAsk}</ShoePrice>
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

  return !displaySneaker ? (
    <Row style={{ minHeight: 'calc(95vh - 96px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner style={{ width: '3rem', height: '3rem' }} />
    </Row>
  ) : (
    <Row style={{ minHeight: 'calc(95vh - 96px)' }}>
      <Col md='6'>
        <SizesGrid />
      </Col>
      <Col md='6'>
        <CenterContainer>
          <SneakerCard sneaker={displaySneaker} maxWidth='400px' />
          {/* TODO: implement the logic for checkout */}
          <Button
            disabled={selectedIdx === undefined}
            style={{ display: 'block', margin: 'auto' }}
            color='primary'
            onClick={() => console.log('BUY ME!')}
          >
            Buy
          </Button>
        </CenterContainer>
      </Col>
    </Row>
  );
};

export default BuySneakerPage;
