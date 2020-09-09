import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Container } from 'reactstrap';
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
  const history = useHistory();

  const fetchSellers = async () => {
    const [, hyphenedName, size] = history.location.pathname.split('/');
    const sneakerName = hyphenedName.split('-').join(' ');

    const sellersBySneakerNameSize = await getSellersBySneakerNameSize(sneakerName, Number(size)).catch((err) =>
      console.log(err)
    );

    if (!sellersBySneakerNameSize) return undefined;

    return sellersBySneakerNameSize;
  };

  useEffect(() => {
    (async () => {
      const fetched = await fetchSellers();

      if (!fetched) return;

      setSellers(fetched);
    })();
  }, []);

  return !sellers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(95vh - 96px)', }} fluid='md'>
      <ListGroup>
        {sellers.map(({ userName, email, askingPrice }, idx) => (
          // do something after on clikc
          <ListGroupItem tag='button' key={idx} action>
            <pre style={{ margin: 0 }}>
              Name: {userName}    Email: {email}    Asking Price: ${askingPrice}
            </pre>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  );
};

export default SellersList;
