import React, { useState } from 'react';

import { ContactButton } from './StyledButton';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Input } from 'reactstrap';
import defaultAvatar from 'assets/img/placeholder.jpg';

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

  const { username } = customer;
  return (
    <React.Fragment>
      <ContactButton onClick={handleShow}>{title}</ContactButton>
      <Dialog open={showContact} onClose={handleClose} className="chat-container">
        <DialogTitle>
          {username || 'Anonymous'}
          <span className="close"><i className="fa fa-times-circle"></i></span>
        </DialogTitle>
        <DialogContent>
          <div className="message-left">
            <div className="profile">
              <div className='photo' style={{ backgroundColor: 'white' }}>
                <img className='h-100' src={defaultAvatar} alt='uploaed file' />
              </div>
              <span>10: 55am</span>
            </div>
            <div className="chat-content-left">Hi!</div>
          </div>
          <div className="message-right">
            <div className="chat-content-right">Hello</div>
            <div className="profile">
              <div className='photo' style={{ backgroundColor: 'white' }}>
                <img className='h-100' src={defaultAvatar} alt='uploaed file' />
              </div>
              <span>11: 00am</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Input placeholder="Type your message here" />
          <i className="send"></i>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ContactCustomerButton;
