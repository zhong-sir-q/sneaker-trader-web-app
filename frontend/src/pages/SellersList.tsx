import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Container, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import CenterSpinner from 'components/CenterSpinner';

import {
  getSellersBySneakerNameSize,
  mailAfterPurchase,
  decreaseWalletBalance,
  createTransaction,
  purchaseListedProduct,
  getProductByNamecolorwaySize,
} from 'api/api';

import { ContactSellerMailPayload, User } from '../../../shared';
import { SIGNIN, AUTH } from 'routes';
import { getCurrentUser } from 'utils/auth';

type Seller = {
  id: number;
  userName: string;
  email: string;
  askingPrice: number;
};

const transactionFees = (price: number) => price * 0.1;

const SellersList = () => {
  const [sellers, setSellers] = useState<Seller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>();
  const [currentCustomer, setCurrentCustomer] = useState<User>();

  const history = useHistory();

  const sneakerInfo = history.location.pathname.split('/');
  const sneakerNameColorway = sneakerInfo[1].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  const formatProductName = () => {
    return `Size ${sneakerSize} ${sneakerNameColorway}`;
  };

  const fetchSetSellers = async () => {
    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerNameColorway, sneakerSize);

    setSellers(sellersBySneakerNameSize);
  };

  const onComponentLoaded = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) history.push(AUTH + SIGNIN, history.location.pathname);
    else {
      fetchSetSellers();
      setCurrentCustomer(currentUser);
    }
  };

  useEffect(() => {
    // settimeout to wait to fetch the current customer first
    onComponentLoaded();
  });

  const formatMailPayload = async (sellerIdx: number): Promise<ContactSellerMailPayload> => {
    const { userName, email } = currentCustomer!;

    const mailPayload: ContactSellerMailPayload = {
      sellerUserName: sellers![sellerIdx].userName,
      sellerEmail: sellers![sellerIdx].email,
      buyerUserName: userName,
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
    const { askingPrice } = sellers![selectedSellerIdx];
    const processingFee = transactionFees(askingPrice);

    // TODO: ask seniors what is the best ways to handle errors here
    // need to rollback the transactions if there are any incorrect ops

    try {
      const product = await getProductByNamecolorwaySize(sneakerNameColorway, sneakerSize);
      // update the listed product status to sold
      await purchaseListedProduct({ productId: product!.id!, sellerId });

      await createTransaction({
        buyerId: currentCustomer!.id!,
        sellerId,
        amount: askingPrice,
        processingFee,
        productId: product!.id!,
      });

      // make sure the amount passed in is the transaction fees!!!
      await decreaseWalletBalance({ userId: sellerId, amount: processingFee });

      // increment the ranking points of both users

      const mailPayload = await formatMailPayload(selectedSellerIdx);

      mailAfterPurchase(mailPayload).then(() => {
        alert('The seller will be in touch with you shortly');
        history.push('/');
      });
    } catch (err) {}
  };

  return !sellers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      <ListGroup>
        {sellers.map(({ userName, askingPrice }, idx) => (
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
              <span>User Name: {userName}</span>
              <span>Asking Price: ${askingPrice}</span>
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
