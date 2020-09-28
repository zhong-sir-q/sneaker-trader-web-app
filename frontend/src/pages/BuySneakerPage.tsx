import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core';
import { Container, Button, Row, Col, Table } from 'reactstrap';

import CenterSpinner from 'components/CenterSpinner';

import { Sneaker, SizeMinPriceGroupType, SneakerAsk } from '../../../shared';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

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
    const items = await ListedSneakerControllerInstance.getSizeMinPriceGroupByName(shoeName)
    const asks = await ListedSneakerControllerInstance.getAllAsksByNameColorway(shoeName)

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

  const onClickSize = (size: number | 'all') => setSelectedSize(size);

  const SizesGrid = () => {
    const renderTiles = () => {
      const minPrice = Math.min(...sizeMinPriceGroup!.map((item) => item.minPrice));

      const allSize = [
        <SizeTile
          onClick={() => onClickSize('all')}
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
            onClick={() => onClickSize(size)}
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

  const onBuy = () => history.push(history.location.pathname + '/' + displaySneaker!.size, displaySneaker);

  if (displaySneaker && sizeMinPriceGroup && filterAllAsks)
    return (
      <Container fluid='md'>
        <h2>{`${displaySneaker.name} ${displaySneaker.colorway}`}</h2>
        <Row style={{ minHeight: 'calc(95vh - 96px)' }}>
          <Col sm='4' md='4'>
            <SizesGrid />
          </Col>
          <Col sm='8' md='8'>
            <CenterContainer>
              {/* TODO: try use the sneaker card here */}
              <img
                style={{ maxWidth: '500px', width: '100%', height: '100%' }}
                alt={displaySneaker.name}
                src={displaySneaker.imageUrls!.split(',')[0]}
              />
              <Button onClick={() => onViewAllAsks()}>View All Asks</Button>
              <Button
                disabled={selectedSize === 'all'}
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
