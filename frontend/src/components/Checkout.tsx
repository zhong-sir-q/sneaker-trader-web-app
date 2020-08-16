import React from 'react';

import stripePromise from 'config/stripeProimse';
import { AuthStateContext } from 'providers/AuthStateProvider';
import { CustomerContext } from 'providers/CustomerContextProvider';

import { API_BASE_URL } from 'routes';

type GetCheckOutSessionIdArgs = {
  priceId: string;
  productId: string;
  customerId: string;
};

/**
 * @param args : priceId is mandatory to create the session. Attach customerId to create a session for existing
 * customer, then also attach the productId to the meta data to make a record in the user's buying_history table
 */
const getCheckoutSessionId = async (args: GetCheckOutSessionIdArgs) => {
  const { priceId, productId, customerId } = args;

  const queryString = `priceId=${priceId}&productId=${productId}&customerId=${customerId}`;
  const endpoint = API_BASE_URL + `checkoutSession?${queryString}`;

  const response = await fetch(endpoint);
  const { sessionId } = await response.json();

  return sessionId;
};

interface CheckoutProps {
  priceId: string;
  productId: string;
}

const Checkout = (props: CheckoutProps) => {
  const { isUserSignedIn } = React.useContext(AuthStateContext);
  const { customerId } = React.useContext(CustomerContext);
  const { priceId, productId } = props;

  const redirecToCheckout = async (evt: React.MouseEvent) => {
    evt.preventDefault();

    if (!isUserSignedIn()) {
      alert('Please log in before completing the purchases');
      return;
    }

    const sessionId = await getCheckoutSessionId({ priceId, productId, customerId });

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) console.warn(error.message);
  };

  return (
    <button onClick={redirecToCheckout} type="button">
      Buy this shoe
    </button>
  );
};

export default Checkout;
