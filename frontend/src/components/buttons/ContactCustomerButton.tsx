import React, { useState, useEffect } from 'react';

import { ContactButton } from './StyledButton';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ChatControllerInstance from 'api/controllers/ChatController';
import { Input } from 'reactstrap';
import defaultAvatar from 'assets/img/placeholder.jpg';

import { Customer } from '../../../../shared';
import { useAuth } from 'providers/AuthProvider';

import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_SERVER as string);

type ContactCustomerButtonProps = {
  customer: Customer;
  title: string;
  productId: number;
  userId: number;
  userType: string;
};

const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
  const { customer, title, productId, userId, userType } = props;

  const { username } = customer;

  const [showContact, setShowContact] = useState(false);

  const { currentUser } = useAuth();

  const handleShow = () => setShowContact(true);
  const handleClose = () => setShowContact(false);

  const [messages, setMessages] = useState([]);
  const [buyerId, setBuyerId] = useState(0);
  const [sellerId, setSellerId] = useState(0);

  const [text, setText] = useState('');
  const handleChange = (evt: any) => setText(evt.target.value);

  const handleSubmit = async () => {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    const data = { message: text, buyerId, sellerId, userType, time, productId };
    socket.emit('message', data);
    setText('');
  };

  useEffect(() => {
    socket.on('newMessage', () => {
      getMessages();
    });

    const getMessages = async () => {
      if (currentUser) {
        const buyerId = userType === 'seller' ? customer.id : currentUser?.id;
        const sellerId = userType === 'buyer' ? userId : currentUser?.id;

        setBuyerId(buyerId);
        setSellerId(sellerId);

        const response = await ChatControllerInstance.getChatByProductIdAndBuyerIDAndSellerId(
          productId,
          buyerId,
          sellerId
        );
        
        // NOTE: why sometimes response is undefined?
        if (response) setMessages(response);
      }
    };

    getMessages();
  });

  return (
    <>
      <ContactButton onClick={handleShow}>{title}</ContactButton>
      <Dialog open={showContact} onClose={handleClose} className='chat-container'>
        <DialogTitle>
          {username || 'Anonymous'}
          <span className='close' onClick={handleClose}>
            <i className='fa fa-times-circle'></i>
          </span>
        </DialogTitle>
        <DialogContent>
          {messages.length > 0 &&
            messages.map(function (item: any, idx: number) {
              const date = new Date(item.dateTime);
              const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
              const offset = date.getTimezoneOffset() / 60;
              const hours = date.getHours();
              newDate.setHours(hours - offset);
              const time = newDate.toLocaleString();
              const splitValue = time.split(' ')[1];
              const splitChatTime = splitValue.split(':');
              const chatTime = `${splitChatTime[0]}: ${splitChatTime[1]}`;

              if (item.userType === userType) {
                return (
                  <div className='message-right' key={idx}>
                    <div className='chat-content-right'>{item.message}</div>
                    <div className='profile'>
                      <div className='photo' style={{ backgroundColor: 'white' }}>
                        <img className='h-100' src={defaultAvatar} alt='uploaed file' />
                      </div>
                      <span>{chatTime}</span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className='message-left' key={idx}>
                    <div className='profile'>
                      <div className='photo' style={{ backgroundColor: 'white' }}>
                        <img className='h-100' src={defaultAvatar} alt='uploaed file' />
                      </div>
                      <span>{chatTime}</span>
                    </div>
                    <div className='chat-content-left'>{item.message}</div>
                  </div>
                );
              }
            })}
        </DialogContent>
        <DialogActions>
          <Input placeholder='Type your message here' value={text} onChange={handleChange} />
          <i className='send' onClick={handleSubmit}></i>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContactCustomerButton;
