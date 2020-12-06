import React, { useState } from 'react';

import { ContactButton } from './StyledButton';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';

import { Customer } from '../../../../shared';
import { USER_RATING } from 'const/variables';

type ContactCustomerButtonProps = {
  customer: Customer;
  title: string;
};

const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
  const [showContact, setShowContact] = useState(false);

  const { customer, title } = props;

  const handleShow = () => setShowContact(true);
  const handleClose = () => setShowContact(false);

  const { username, email, phoneNo, buyerRating, sellerRating } = customer;

  return (
    <React.Fragment>
      <ContactButton onClick={handleShow}>{title}</ContactButton>
      <Dialog open={showContact} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <p>Username: {username || 'Anonymous'}</p>
          <p>Email: {email || 'None'}</p>
          <p>Phone Number: {phoneNo || 'None'}</p>
          <p>Rating: {buyerRating || sellerRating || 0} out of ${USER_RATING}</p>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleClose}>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ContactCustomerButton;
