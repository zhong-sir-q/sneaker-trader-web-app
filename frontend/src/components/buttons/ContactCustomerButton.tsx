import React, { useState } from 'react';

import { ContactButton } from './StyledButton';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';

import { Customer } from '../../../../shared';

type ContactCustomerButtonProps = {
  customer: Customer;
  title: string;
};

const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
  const [showContact, setShowContact] = useState(false);

  const { customer, title } = props;

  const handleShow = () => setShowContact(true);
  const handleClose = () => setShowContact(false);

  return (
    <React.Fragment>
      <ContactButton onClick={handleShow}>{title}</ContactButton>
      <Dialog open={showContact} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <p>Email: {customer.email}</p>
          <p>Username: {customer.username}</p>
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
