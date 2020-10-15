import React from 'react';

import styled from 'styled-components';

import { DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core';
import { Container, Button, Row, Col, Table } from 'reactstrap';

import CenterSpinner from 'components/CenterSpinner';
import SneakerCard from 'components/SneakerCard';

import { Sneaker, SizeMinPriceGroupType, SneakerAsk, Size } from '../../../shared';

const CenterContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SizeTile = styled.div`
  background: #fff;
  border: 1px solid #e5e7ea;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 90px;
  height: 70px;
  margin: 4px;
`;

const ShoeSize = styled.div`
  color: #000;
  font-weight: 700;
`;

const ShoePrice = styled.div`
  color: #08a05c;
`;

type SizeTileComponentProps = {
  onClick: () => void;
  sizeText: string;
  price: number;
  isSelected: boolean;
};

const SizeTileComponent = (props: SizeTileComponentProps) => {
  const { onClick, sizeText, price, isSelected } = props;

  return (
    <SizeTile onClick={onClick} style={{ border: isSelected ? '2px solid green' : '' }}>
      <ShoeSize>{sizeText}</ShoeSize>
      <ShoePrice>${price}</ShoePrice>
    </SizeTile>
  );
};

type BuySneakerPageProps = {
  selectedSize: Size;
  displaySneaker: Sneaker | undefined;
  sizeMinPriceGroup: SizeMinPriceGroupType | undefined;
  filterAllAsks: SneakerAsk[] | undefined;
  openViewAskModal: boolean;
  chooseBuyAll: boolean;
  selectedSizeMinPrice: number | undefined;
  onViewAllAsks: () => void;
  onCloseViewAllAsksModal: () => void;
  onClickSizeTile: (size: Size, minPrice: number) => void;
  onBuy: () => void;
};

// use the path name to query the sneaker
const BuySneakerPage = (props: BuySneakerPageProps) => {
  const {
    selectedSize,
    displaySneaker,
    sizeMinPriceGroup,
    filterAllAsks,
    openViewAskModal,
    chooseBuyAll,
    selectedSizeMinPrice,
    onCloseViewAllAsksModal,
    onViewAllAsks,
    onBuy,
    onClickSizeTile,
  } = props;

  const renderTiles = () => {
    if (!sizeMinPriceGroup) return [];

    const allSizeMinPrice = Math.min(...sizeMinPriceGroup.map((item) => item.minPrice));

    const allSize = [
      <SizeTileComponent
        key={-1}
        onClick={() => onClickSizeTile('all', allSizeMinPrice)}
        isSelected={selectedSize === 'all'}
        sizeText='US All'
        price={allSizeMinPrice}
      />,
    ];

    const sizeTiles = sizeMinPriceGroup.map(({ size, minPrice }, idx) => (
      <SizeTileComponent
        key={idx}
        onClick={() => onClickSizeTile(size, minPrice)}
        isSelected={selectedSize === size}
        sizeText={`US ${size}`}
        price={minPrice}
      />
    ));

    return !chooseBuyAll ? allSize.concat(sizeTiles) : sizeTiles;
  };

  const formatSneaker = (): Partial<Sneaker> => ({
    name: displaySneaker?.name,
    colorway: displaySneaker?.colorway,
    size: selectedSize === 'all' ? undefined : selectedSize,
    imageUrls: displaySneaker?.imageUrls,
  });

  if (displaySneaker && sizeMinPriceGroup && filterAllAsks)
    return (
      <Container fluid='md'>
        <h2>{`${displaySneaker.name} ${displaySneaker.colorway}`}</h2>
        <Row style={{ minHeight: 'calc(95vh - 96px)' }}>
          <Col md='4'>
            <Container fluid='md'>
              <Row>{renderTiles()}</Row>
            </Container>
          </Col>
          <Col md='8'>
            <CenterContainer>
              <SneakerCard sneaker={formatSneaker()} price={selectedSizeMinPrice} />
              <Button onClick={onViewAllAsks}>View All Asks</Button>
              <Button
                style={{ display: 'block', margin: 'auto' }}
                color='primary'
                onClick={onBuy}
                disabled={selectedSize === undefined}
              >
                Buy
              </Button>
              <Dialog fullWidth maxWidth='md' onClose={onCloseViewAllAsksModal} open={openViewAskModal}>
                <DialogTitle>All Asks</DialogTitle>
                <DialogContent dividers>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>US Size</th>
                        <th>Ask Price</th>
                        <th># Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterAllAsks.map((ask, idx) => (
                        <tr key={idx}>
                          <td>{ask.size}</td>
                          <td>${ask.askingPrice}</td>
                          <td>{ask.numsAvailable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={onCloseViewAllAsksModal}>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </CenterContainer>
          </Col>
        </Row>
      </Container>
    );
  else return <CenterSpinner />;
};

export default BuySneakerPage;
