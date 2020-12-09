import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import StripeCardSection from './StripeCardSection';
import { useAuth } from 'providers/AuthProvider';

import StripeControllerInstance from 'api/controllers/StripeController';

import { dollarToCent } from 'utils/money';

type StripePaymentCheckoutProps = {
  title: string;
  dollarAmountToCharge: number;
  onConfirmPayment: () => void;
};

const StyledError = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const StripePaymentCheckout = (props: StripePaymentCheckoutProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState<string>();

  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const clientSecret = await StripeControllerInstance.getClientSecret(dollarToCent(props.dollarAmountToCharge));

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as any,
        billing_details: {
          name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        },
      },
    });

    setIsConfirming(true);

    if (result.error) setPaymentError(result.error.message);
    else {
      // The payment has been processed!
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        props.onConfirmPayment();
      }
    }

    setIsConfirming(false);
  };

  elements?.getElement(CardElement)?.on('change', (evt) => {
    if (evt.error) setPaymentError(evt.error.message);
  });

  const disableConfirm = () => !stripe || isConfirming || props.dollarAmountToCharge < 0.5;

  return (
    <form className='text-center w-100' onSubmit={handleSubmit}>
      <h5>{props.title}</h5>
      <StripeCardSection />
      {paymentError && <StyledError>{paymentError}</StyledError>}
      <Button type='submit' color='primary' disabled={disableConfirm()}>
        Confirm
      </Button>
    </form>
  );
};

export default StripePaymentCheckout;
