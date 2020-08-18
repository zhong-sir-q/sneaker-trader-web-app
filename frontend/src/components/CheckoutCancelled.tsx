import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutCancelled = () => (
  <div>
    <p>Payment was cancelled</p>
    <Link to="/">Back to home</Link>
  </div>
);

export default CheckoutCancelled;
