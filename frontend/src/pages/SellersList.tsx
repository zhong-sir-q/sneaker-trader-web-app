import React, { useState, useEffect } from 'react';
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

import { useHistory } from 'react-router-dom';

import _ from 'lodash';

import CenterSpinner from 'components/CenterSpinner';

import {
  getSellersBySneakerNameSize,
  mailAfterPurchase,
  decreaseWalletBalance,
  createProductTransaction,
  purchaseListedProduct,
  getProductByNameColorwaySize,
} from 'api/api';

import { ContactSellerMailPayload, Sneaker } from '../../../shared';
import { SIGNIN, AUTH } from 'routes';
import { useAuth } from 'providers/AuthProvider';
import SneakerCard from 'components/SneakerCard';

export type Seller = {
  id: number;
  rating: number;
  email: string;
  username: string;
  askingPrice: number;
  listedProductId: number;
};

type SortByPriceDropdownProps = {
  sortInDescendingOrder: () => void;
  sortInAscendingOrder: () => void;
};

// TODO: disable the sort option once an order has been selected
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

// NOTE: is it better to process the fees using cents?
const transactionFees = (price: number) => price * 0.1;

const SellersList = () => {
  const [sellers, setSellers] = useState<Seller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>();
  const [sneaker, setSneaker] = useState<Sneaker>();

  const history = useHistory();
  const { signedIn, currentUser } = useAuth();

  const sneakerInfo = history.location.pathname.split('/');
  const sneakerNameColorway = sneakerInfo[1].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  const formatProductName = () => `Size ${sneakerSize} ${sneakerNameColorway}`;

  const onComponentLoaded = async () => {
    if (!signedIn) history.push(AUTH + SIGNIN, history.location.pathname);

    const sneakerToBuy = await getProductByNameColorwaySize(sneakerNameColorway, sneakerSize);
    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerNameColorway, sneakerSize);

    setSneaker(sneakerToBuy);
    setSellers(sellersBySneakerNameSize);
  };

  useEffect(() => {
    if (!sellers) onComponentLoaded();
  });

  const formatMailPayload = async (sellerIdx: number): Promise<ContactSellerMailPayload> => {
    const { username, email } = currentUser!;

    const mailPayload: ContactSellerMailPayload = {
      sellerUserName: sellers![sellerIdx].username,
      sellerEmail: sellers![sellerIdx].email,
      buyerUserName: username,
      buyerEmail: email,
      productName: formatProductName(),
    };

    return mailPayload;
  };


  const onConfirm = async () => {
    if (selectedSellerIdx === undefined) return;

    // deduct the balance from the seller
    const sellerId = sellers![selectedSellerIdx].id;
    const { askingPrice, listedProductId } = sellers![selectedSellerIdx];
    const processingFee = transactionFees(askingPrice);

    // TODO: ask seniors what is the best ways to handle errors here
    // need to rollback the transactions if there are any incorrect ops
    try {
      const mailPayload = await formatMailPayload(selectedSellerIdx);

      mailAfterPurchase(mailPayload).then(() => {
        alert('The seller will be in touch with you shortly');
        history.push('/');
      });

      // update the listed product status to sold
      await purchaseListedProduct({ id: listedProductId, sellerId });

      await createProductTransaction({
        buyerId: currentUser!.id!,
        sellerId,
        amount: askingPrice,
        processingFee,
        listedProductId,
      });

      // make sure the amount passed in is the transaction fees!!!
      await decreaseWalletBalance({ userId: sellerId, amount: processingFee });

      // increment the ranking points of both users
    } catch (err) {}
  };

  const sortSellersByAskingPriceAscending = () => {
    const ascSellers = _.orderBy(sellers, ['askingPrice'], ['asc']);
    setSellers(ascSellers);
  };

  const sortSellersByAskingPriceDescending = () => {
    const descSellers = _.orderBy(sellers, ['askingPrice'], ['desc']);
    setSellers(descSellers);
  };

  const onCancel = () => history.goBack()

  return !sellers || !currentUser || !sneaker ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      <SneakerCard styles={{ margin: 'auto', marginBottom: '15px' }} sneaker={sneaker} maxWidth='400px' />
      <SortByPriceDropdown
        sortInAscendingOrder={sortSellersByAskingPriceAscending}
        sortInDescendingOrder={sortSellersByAskingPriceDescending}
      />
      <ListGroup>
        {sellers.map(({ id, username, askingPrice, rating }, idx) => {
          // the customer cannot buy their own listing
          if (id === currentUser!.id) return undefined;

          return (
            <ListGroupItem
              tag='button'
              key={idx}
              action
              onClick={() => setSelectedSellerIdx(idx)}
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
          );
        })}
      </ListGroup>
      <footer>
        {selectedSellerIdx !== undefined && selectedSellerIdx < sellers.length ? (
          <ListGroup style={{ marginTop: '15px' }}>
            <ListGroupItem>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Transaction fees:</span>
                <span>${transactionFees(sellers[selectedSellerIdx].askingPrice)}</span>
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
            {/* NOTE: Not sure why accessing the sneaker route via the name colorway
            force redirect me back to the gallery page  */}
            <Button style={{ marginRight: '25px' }} onClick={onCancel}>Cancel</Button>
            <Button disabled={selectedSellerIdx === undefined} color='primary' onClick={() => onConfirm()}>
              Confirm
            </Button>
          </div>
          <p className='category' style={{ margin: 0, fontSize: '0.95em' }}>
            We will contact the seller on your behalf to get in touch
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default SellersList;
