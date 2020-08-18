import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => (
  <div>
    <p>Payment was successful</p>
    <Link to="/">Back to home</Link>
  </div>
);

export default CheckoutSuccess;
