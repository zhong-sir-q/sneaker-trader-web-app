import React from 'react';
import { CustomerContext } from 'providers/CustomerContextProvider';
import { API_BASE_URL } from 'routes';
import { BoughtSneaker, TransactionStatus } from '../../../shared'


const getUserBuyingHistory = async (customerId: string): Promise<BoughtSneaker[]> => {
  if (customerId) {
    const buyingHistoryEndpoint = API_BASE_URL + `buying_history/${customerId}`;
    const response = await fetch(buyingHistoryEndpoint);
    const { transactions } = await response.json();

    return transactions;
  } else return [];
};

const extractBoughtSneakerProps = (sneakerTransaction: BoughtSneaker): BoughtSneakerProps => {
  const { name, status, size, price, payment_intent_id, image_url } = sneakerTransaction;

  return { name, status, size, price, paymentIntentId: payment_intent_id, imageUrl: image_url };
};

const BuyingHistory = () => {
  const { customerId } = React.useContext(CustomerContext);
  const [boughtSneakers, setBoughtSneakers] = React.useState<BoughtSneakerProps[]>([]);

  React.useEffect(() => {
    (async () => {
      const sneakerTransactions = await getUserBuyingHistory(customerId);
      const allBoughtSneakers = sneakerTransactions.map((st) => extractBoughtSneakerProps(st));
      setBoughtSneakers(allBoughtSneakers);
    })();

    // useEffect depends on the state of the customerId because it will
    // not be fetched using the context api immediately
  }, [customerId, setBoughtSneakers]);

  return (
    <React.Fragment>
      {boughtSneakers.map((transaction, idx) => (
        <BoughtSneakerItem key={idx} {...transaction} />
      ))}
    </React.Fragment>
  );
};

const createRefund = async (paymentIntentId: string) => {
  const refundEndpoint = API_BASE_URL + `refund/${paymentIntentId}`;

  return fetch(refundEndpoint);
};

interface BoughtSneakerProps {
  name: string;
  status: TransactionStatus;
  size: number;
  price: number;
  paymentIntentId: string;
  imageUrl?: string;
}

// available keys from the get all buying history query result, payment_intent_id, customer_id,
// product_id, status, id, size, brand, color_way, serial_number, price, price_id, description, name, image_url
// TODO: add a button to refund the sneaker
const BoughtSneakerItem = (props: BoughtSneakerProps) => {
  const { paymentIntentId, name, price, status } = props;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <p>{name}</p>
      <p>{price}</p>
      <p>{status}</p>
      <button
        disabled={status === 'refunded'}
        onClick={() =>
          createRefund(paymentIntentId)
            .then((res) => res.json())
            .then((j) => alert(j))
            .catch((err) => alert(err.message))
        }
      >
        Get Refund
      </button>
    </div>
  );
};

export default BuyingHistory;
