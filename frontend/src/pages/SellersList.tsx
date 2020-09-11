import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Container, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import CenterSpinner from 'components/CenterSpinner';

import { fetchCognitoUser } from 'utils/auth';
import { getSellersBySneakerNameSize, fetchUserByEmail, contactSellerAfterPurchase } from 'api/api';

import { ContactSellerMailPayload } from '../../../shared';
import { SIGNIN, AUTH } from 'routes';

type Seller = {
  userName: string;
  email: string;
  askingPrice: number;
};

const SellersList = () => {
  const [sellers, setSellers] = useState<Seller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>();

  const history = useHistory();

  const sneakerInfo = () => history.location.pathname.split('/');

  const formatProductName = () => {
    const [, hyphenedName, size] = sneakerInfo();
    return `Size ${size} ${hyphenedName.split('-').join(' ')}`;
  };

  const fetchSetSellers = async () => {
    const [, hyphenedName, size] = sneakerInfo();
    const sneakerName = hyphenedName.split('-').join(' ');

    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerName, Number(size)).catch((err) =>
      console.log(err)
    );

    if (!sellersBySneakerNameSize) return;

    setSellers(sellersBySneakerNameSize);
  };

  const onComponentLoaded = async () => {
    const user = await fetchCognitoUser();
    // handle unauthenticated user
    if (!user) history.push(AUTH + SIGNIN, history.location.pathname);
    else fetchSetSellers();
  };

  useEffect(() => {
    onComponentLoaded();
  });

  const formatMailPayload = async (sellerIdx: number): Promise<ContactSellerMailPayload> => {
    const { email } = await fetchCognitoUser();
    const { userName } = await fetchUserByEmail(email);

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

    const mailPayload = await formatMailPayload(selectedSellerIdx);

    contactSellerAfterPurchase(mailPayload)
      .then(() => {
        alert('The seller will be in touch with you shortly');
        history.push('/');
      })
      .catch((err) => {
        // do something after error
      });
  };

  return !sellers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      <ListGroup>
        {sellers.map(({ userName, email, askingPrice }, idx) => (
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
              borderTopWidth: '1.2px',
            }}
          >
            <pre style={{ margin: 0 }}>
              User Name: {userName} Email: {email} Asking Price: ${askingPrice}
            </pre>
          </ListGroupItem>
        ))}
      </ListGroup>
      <footer className='text-center'>
        <Button color='primary' onClick={() => onConfirm()}>
          Confirm
        </Button>
        <p className='category' style={{ margin: 0, fontSize: '0.95em' }}>
          We will contact the seller on your behalf to get in touch
        </p>
      </footer>
    </Container>
  );
};

export default SellersList;
