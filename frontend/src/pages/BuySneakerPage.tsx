import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core';
import { Container, Button, Row, Col, Table } from 'reactstrap';

import SneakerCard from 'components/SneakerCard';
import CenterSpinner from 'components/CenterSpinner';

import { Sneaker, SizeMinPriceGroupType, SneakerAsk } from '../../../shared';
import { getUserSizeGroupedPrice, getAllAsksByNameColorway } from 'api/api';

const CenterContainer = styled(Container)`
  text-align: center;
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

const StyledSneakerCard = styled(SneakerCard)`
  max-width: 400px;

  @media (max-width: 549px) {
    width: 152px;
  }

  @media (max-width: 767px) {
    width: 224px;
  }
`;

const nameColorwayFromPath = () => {
  const { pathname } = window.location;

  const pathArray = pathname.split('/');
  const shoeName = pathArray[pathArray.length - 1].split('-').join(' ');

  return shoeName;
};

// use the path name to query the sneaker
const BuySneakerPage = () => {
  const [selectedSize, setSelectedSize] = useState<number | 'all'>('all');
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  const [sizeMinPriceGroup, setSizeMinPriceGroup] = useState<SizeMinPriceGroupType>();

  const [allAsks, setAllAsks] = useState<SneakerAsk[]>();
  const [filterAllAsks, setFilterAllAsks] = useState<SneakerAsk[]>();

  const [openModal, setOpenModal] = useState(false);

  const history = useHistory();

  const onComponentMounted = useCallback(async () => {
    const shoeName = nameColorwayFromPath();
    const items = await getUserSizeGroupedPrice(shoeName);
    const asks = await getAllAsksByNameColorway(shoeName);

    // the state is passed through from SneakerCard
    const sneaker = history.location.state as Sneaker;

    if (!sneaker) {
      history.push('/');
      return;
    }

    setAllAsks(asks);
    setFilterAllAsks(asks);

    setDisplaySneaker(sneaker);
    setSizeMinPriceGroup(items);
  }, [history]);

  useEffect(() => {
    onComponentMounted();
  }, [onComponentMounted]);

  const onClickSize = (price: number, size: number | 'all') => {
    setSelectedSize(size);
    setDisplaySneaker({ ...displaySneaker!, price, size: Number(size) });
  };

  const SizesGrid = () => {
    const renderTiles = () => {
      const minPrice = Math.min(...sizeMinPriceGroup!.map((item) => item.minPrice));
      const allSize = [
        <SizeTile
          onClick={() => onClickSize(minPrice, 'all')}
          key={-1}
          style={{ border: selectedSize === 'all' ? '2px solid green' : '' }}
        >
          <ShoeSize>US All</ShoeSize>
          <ShoePrice>${minPrice}</ShoePrice>
        </SizeTile>,
      ];

      return allSize.concat(
        sizeMinPriceGroup!.map(({ size, minPrice }, idx) => (
          <SizeTile
            onClick={() => onClickSize(minPrice, size)}
            key={idx}
            style={{ border: selectedSize === size ? '2px solid green' : '' }}
          >
            <ShoeSize>US {size}</ShoeSize>
            <ShoePrice>${minPrice}</ShoePrice>
          </SizeTile>
        ))
      );
    };

    return (
      <Container>
        <Row>{renderTiles()}</Row>
      </Container>
    );
  };

  const onViewAllAsks = () => {
    setOpenModal(true);

    if (selectedSize === 'all') setFilterAllAsks(allAsks);
    else setFilterAllAsks(allAsks?.filter((ask) => ask.size === selectedSize));
  };

  const onBuy = () => {
    if (selectedSize === 'all') {
      alert('Please select a size')
      return
    }

    history.push(history.location.pathname + '/' + displaySneaker!.size)
  }

  if (displaySneaker && sizeMinPriceGroup && filterAllAsks)
    return (
      <Container fluid='md'>
        <h1>{`${displaySneaker.name} ${displaySneaker.colorway}`}</h1>
        <Row style={{ minHeight: 'calc(95vh - 96px)' }}>
          <Col md='6'>
            <SizesGrid />
          </Col>
          <Col md='6'>
            <CenterContainer>
              <img alt={displaySneaker.name} src={displaySneaker.imageUrls!.split(',')[0]} />
              <Button onClick={() => onViewAllAsks()}>View All Asks</Button>
              <Button
                style={{ display: 'block', margin: 'auto' }}
                color='primary'
                onClick={() => onBuy()}
              >
                Buy
              </Button>
              <Dialog fullWidth maxWidth='md' onClose={() => setOpenModal(false)} open={openModal}>
                <DialogTitle>All Asks</DialogTitle>
                <DialogContent dividers>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Ask Price</th>
                        <th># Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterAllAsks.map((ask, idx) => (
                        <tr key={idx}>
                          <td>{ask.size}</td>
                          <td>{ask.askingPrice}</td>
                          <td>{ask.numsAvailable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={() => setOpenModal(false)}>
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
