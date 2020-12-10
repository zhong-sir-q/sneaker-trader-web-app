import React, { useState, useEffect } from 'react';

import { ContactButton } from './StyledButton';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ChatControllerInstance from 'api/controllers/ChatController';
import { Input } from 'reactstrap';
import defaultAvatar from 'assets/img/placeholder.jpg';

import { Customer } from '../../../../shared';
import { useAuth } from 'providers/AuthProvider';

import { io } from 'socket.io-client';
import useScrollBottom from 'hooks/useScrollBottom';

const socket = io(process.env.REACT_APP_API_SERVER as string);

type ContactCustomerButtonProps = {
  customer: Customer;
  title: string;
  productId: number;
  userId: number;
  userType: string;
};

const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
  const [showContact, setShowContact] = useState(false);

  const { customer, title, productId, userId, userType } = props;
  const { currentUser } = useAuth();

  const [text, setText] = useState('');

  const [buyerId, setBuyerId] = useState(0);
  const [sellerId, setSellerId] = useState(0);

  const [messages, setMessages] = useState([]);
  const [messageEndRef, scrollToMessageEnd] = useScrollBottom(messages);

  const handleShow = () => {
    setShowContact(true);
    // allow some time for the the message end to mount
    setTimeout(() => scrollToMessageEnd(), 0);
  };

  const [initialized, setInitialized] = useState(false);

  const [unreadMessageIds, setUnreadMessageIds] = useState<number[]>([]);

  const handleChange = (evt: any) => setText(evt.target.value);

  const handleSubmit = () => {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    const data = { message: text, buyerId, sellerId, userType, time, productId };
    socket.emit('message', data);
    setText('');
  };

  const handleClose = async () => {
    if (unreadMessageIds.length) {
      await ChatControllerInstance.updateStatus(unreadMessageIds, 'read');
      getMessages();
    }
    setShowContact(false);
  };

  const connectToRoom = () => {
    socket.on('connect', () => {
      const roomName = `${productId}_${buyerId}_${sellerId}`;
      socket.emit('join', roomName);
    });
    socket.on('newMessage', () => {
      getMessages();
    });

    setInitialized(true);
  };

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

      setMessages(response);

      if (response && response.length) {
        const chatIds: Array<number> = [];
        for (const entry of response) {
          if (entry.status === 'unread' && entry.userType !== userType) {
            chatIds.push(entry.id);
          }
        }
        setUnreadMessageIds(chatIds);
      }
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (!initialized) {
      getMessages();
      connectToRoom();
    }
  });

  const { username } = customer;

  // important to use message-right, so it will occur at the bottom of the message list, so
  // scollIntoView will reach the bottom of the chatbox
  const MessageEnd = () => <div className='message-right' ref={messageEndRef} />;

  return (
    <React.Fragment>
      <ContactButton onClick={handleShow}>
        {title}
        {unreadMessageIds.length !== 0 ? <span className='notify'></span> : null}
      </ContactButton>
      <Dialog open={showContact} onClose={handleClose} className='chat-container'>
        <DialogTitle>
          {username || 'Anonymous'}
          <span className='close' onClick={handleClose}>
            <i className='fa fa-times-circle'></i>
          </span>
        </DialogTitle>
        <DialogContent>
          {messages &&
            messages.length &&
            messages.map(function (item: any, idx: any) {
              const date = new Date(item.dateTime);
              const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
              const offset = date.getTimezoneOffset() / 60;
              const hours = date.getHours();
              newDate.setHours(hours - offset);
              const time = newDate.toLocaleString();
              const splitValue = time.split(' ')[1];
              const splitChatTime = splitValue.split(':');
              const chatTime = `${splitChatTime[0]}: ${splitChatTime[1]}`;

              // the current user
              if (item.userType === userType) {
                return (
                  <div className='message-right' key={idx}>
                    <div className='chat-content-right'>{item.message}</div>
                    <div className='profile'>
                      <div className='photo' style={{ backgroundColor: 'white' }}>
                        <img className='h-100' src={currentUser?.profilePicUrl || defaultAvatar} alt='uploaed file' />
                      </div>
                      <span>{chatTime}</span>
                    </div>
                  </div>
                );
              } else {
                // the customer to contact
                return (
                  <div className='message-left' key={idx}>
                    <div className='profile'>
                      <div className='photo' style={{ backgroundColor: 'white' }}>
                        <img className='h-100' src={customer.profilePicUrl || defaultAvatar} alt='uploaed file' />
                      </div>
                      <span>{chatTime}</span>
                    </div>
                    <div className='chat-content-left'>{item.message}</div>
                  </div>
                );
              }
            })}
          <MessageEnd />
        </DialogContent>
        <DialogActions>
          <Input
            placeholder='Type your message here'
            value={text}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <i className='send' onClick={handleSubmit}></i>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ContactCustomerButton;
