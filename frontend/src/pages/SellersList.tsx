import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Container, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import CenterSpinner from 'components/CenterSpinner';

import {
  getSellersBySneakerNameSize,
  mailAfterPurchase,
  decreaseWalletBalance,
  createProductTransaction,
  purchaseListedProduct,
} from 'api/api';

import { ContactSellerMailPayload, User } from '../../../shared';
import { SIGNIN, AUTH } from 'routes';
import { getCurrentUser } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

export type Seller = {
  id: number;
  rating: number;
  email: string;
  username: string;
  askingPrice: number;
  listedProductId: number;
};

const transactionFees = (price: number) => price * 0.1;

const SellersList = () => {
  const [sellers, setSellers] = useState<Seller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>();
  const [currentCustomer, setCurrentCustomer] = useState<User>();

  const history = useHistory();
  const { signedIn } = useAuth();

  const sneakerInfo = history.location.pathname.split('/');
  const sneakerNameColorway = sneakerInfo[1].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  const formatProductName = () => {
    return `Size ${sneakerSize} ${sneakerNameColorway}`;
  };

  const onComponentLoaded = async () => {
    if (!signedIn) history.push(AUTH + SIGNIN, history.location.pathname);

    const currentUser = await getCurrentUser();

    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerNameColorway, sneakerSize);
    setSellers(sellersBySneakerNameSize);

    setCurrentCustomer(currentUser);
  };

  useEffect(() => {
    if (!currentCustomer) onComponentLoaded();
  });

  const formatMailPayload = async (sellerIdx: number): Promise<ContactSellerMailPayload> => {
    const { username, email } = currentCustomer!;

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
    if (selectedSellerIdx === undefined) {
      alert('Please select a seller');
      return;
    }

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
        buyerId: currentCustomer!.id!,
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

  return !sellers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      <ListGroup>
        {sellers.map(({ username, askingPrice, rating }, idx) => (
          // TODO: when screen size is smaller than 650px,
          // make the item layout to be column rather than row
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
        ))}
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
          <Button color='primary' onClick={() => onConfirm()}>
            Confirm
          </Button>
          <p className='category' style={{ margin: 0, fontSize: '0.95em' }}>
            We will contact the seller on your behalf to get in touch
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default SellersList;
