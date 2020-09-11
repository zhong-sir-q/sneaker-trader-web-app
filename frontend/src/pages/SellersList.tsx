import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Container, Button } from 'reactstrap';
import CenterSpinner from 'components/CenterSpinner';
import { useHistory } from 'react-router-dom';
import { getSellersBySneakerNameSize } from 'api/api';

type Seller = {
  userName: string;
  email: string;
  askingPrice: number;
};

const SellersList = () => {
  const [sellers, setSellers] = useState<Seller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>();

  const history = useHistory();

  const fetchSetSellers = async () => {
    const [, hyphenedName, size] = history.location.pathname.split('/');
    const sneakerName = hyphenedName.split('-').join(' ');

    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerName, Number(size)).catch((err) =>
      console.log(err)
    );

    if (!sellersBySneakerNameSize) return;

    setSellers(sellersBySneakerNameSize);
  };

  useEffect(() => {
    fetchSetSellers();
  });

  return !sellers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)' }} fluid='md'>
      <ListGroup>
        {sellers.map(({ userName, email, askingPrice }, idx) => (
          // do something after on clikc
          <ListGroupItem
            tag='button'
            key={idx}
            action
            onClick={() => setSelectedSellerIdx(idx)}
            style={{ borderColor: idx === selectedSellerIdx ? 'green' : undefined, outline: 'none' }}
          >
            <pre style={{ margin: 0 }}>
              User Name: {userName} Email: {email} Asking Price: ${askingPrice}
            </pre>
          </ListGroupItem>
        ))}
      </ListGroup>
      <footer className='text-center'>
        <Button color='primary' onClick={() => console.log('Contact seller')}>
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
