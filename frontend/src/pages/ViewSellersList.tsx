import React, { useState } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Container,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import SneakerCard from 'components/SneakerCard';
import CenterSpinner from 'components/CenterSpinner';
import SneakerCarousel from 'components/SneakerCarousel';

import getTransactionFees from 'usecases/getTransactionFee';

import { ListedSneakerSeller, Sneaker } from '../../../shared';

type SortByPriceDropdownProps = {
  sortInDescendingOrder: () => void;
  sortInAscendingOrder: () => void;
};

const SortByPriceDropdown = (props: SortByPriceDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { sortInAscendingOrder, sortInDescendingOrder } = props;

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle color='primary' caret>
          Sort by
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={sortInDescendingOrder}>Price: Hight-Low</DropdownItem>
          <DropdownItem onClick={sortInAscendingOrder}>Price: Low-High</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const getSellerSeneakrImgUrls = (imageUrls: string) => imageUrls.split(',');

type ViewSellersListProps = {
  sellers: ListedSneakerSeller[] | undefined;
  selectedSellerIdx: number;
  displaySneaker: Sneaker | undefined;
  processingPurchase: boolean;
  sortSellersByAskingPriceAscending: () => void;
  sortSellersByAskingPriceDescending: () => void;
  onCancel: () => void;
  onSelectSeller: (sellerIdx: number) => void;
  onConfirm: () => void;
};

const ViewSellersList = (props: ViewSellersListProps) => {
  const {
    sellers,
    selectedSellerIdx,
    displaySneaker,
    sortSellersByAskingPriceAscending,
    sortSellersByAskingPriceDescending,
    onCancel,
    onConfirm,
    processingPurchase,
    onSelectSeller,
  } = props;

  return !sellers || !displaySneaker || processingPurchase ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      {selectedSellerIdx === -1 ? (
        <SneakerCard
          styles={{ margin: 'auto', marginBottom: '15px' }}
          sneaker={displaySneaker}
          price={undefined}
          maxWidth='400px'
        />
      ) : (
        <SneakerCarousel imgUrlItems={getSellerSeneakrImgUrls(sellers[selectedSellerIdx].imageUrls)} />
      )}
      <SortByPriceDropdown
        sortInAscendingOrder={sortSellersByAskingPriceAscending}
        sortInDescendingOrder={sortSellersByAskingPriceDescending}
      />
      <ListGroup>
        {sellers.map(({ username, askingPrice, rating }, idx) => (
          <ListGroupItem
            tag='button'
            key={idx}
            action
            onClick={() => onSelectSeller(idx)}
            style={{
              borderColor: idx === selectedSellerIdx ? 'green' : undefined,
              outline: 'none',
              borderTopWidth: '1px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>User Name: {username}</span>
              <span>Asking Price: ${askingPrice}</span>
              <span>Rating: {!rating || rating <= 0 ? 0 : rating}</span>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <footer>
        {selectedSellerIdx !== -1 && selectedSellerIdx < sellers.length ? (
          <ListGroup style={{ marginTop: '15px' }}>
            <ListGroupItem>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Transaction fees:</span>
                <span>${getTransactionFees(sellers[selectedSellerIdx].askingPrice)}</span>
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total:</span>
                <span>${sellers[selectedSellerIdx].askingPrice}</span>
              </div>
            </ListGroupItem>
          </ListGroup>
        ) : null}
        <div className='text-center'>
          <div>
            <Button style={{ marginRight: '25px' }} onClick={onCancel}>
              Cancel
            </Button>
            <Button disabled={selectedSellerIdx === -1} color='primary' onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </footer>
    </Container>
  );
};

export default ViewSellersList;
