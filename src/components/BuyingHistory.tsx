import React from 'react';
import { CustomerContext } from 'providers/CustomerContextProvider';
import { API_BASE_URL } from 'routes';

/**
 * - remove the gatsby framework
 * - update the gatsby dependent logic, e.g. would the api route still work? The logic of pulling the data from express
 * - carry on with the features below
 */

// Final workflow
// the client can create the refund from that view, it sends a request along with the payment_intent id to express

// after the server successfully refunds the shoe, it would change the status from 'completed' to 'refunded'

// NOTE: An ideal option would be to store the result in a global state store, so I do not have to make an API call
// every time the user visits the buying history section. Hence the current solution may not be the most optimal one.
const getUserBuyingHistory = async (customerId: string): Promise<BoughtSneakerProps[]> => {
  // NOTE: sometimes this function will get called twice inside useEffect, the second the function
  // is called will raise a 404 NOT FOUND error. I have not investigated the reason yet.
  const buyingHistoryEndpoint = API_BASE_URL + `buying_history/${customerId}`;

  const response = await fetch(buyingHistoryEndpoint);
  const data = await response.json();

  return data.transactions;
};

const BuyingHistory = () => {
  const { customerId } = React.useContext(CustomerContext);
  const [boughtSneakers, setBoughtSneakers] = React.useState<BoughtSneakerProps[]>([]);

  React.useEffect(() => {
    (async () => {
      const transactions: BoughtSneakerProps[] = await getUserBuyingHistory(customerId);
      setBoughtSneakers(transactions);
    })();
  }, [customerId, setBoughtSneakers]);

  return (
    <React.Fragment>
      {boughtSneakers.map((transaction, idx) => (
        <BoughtSneaker key={idx} {...transaction} />
      ))}
    </React.Fragment>
  );
};

interface BoughtSneakerProps {
  name: string;
  status: string;
  size: number;
  price: number;
  paymentIntentId: string;
  imageUrl?: string;
}

// available keys from the get all buying history query result, payment_intent_id, customer_id,
// product_id, status, id, size, brand, color_way, serial_number, price, price_id, description, name, image_url
// TODO: add a button to refund the sneaker
const BoughtSneaker = (props: BoughtSneakerProps) => {
  const { name, price } = props;

  return <div />;
};

export default BuyingHistory;
