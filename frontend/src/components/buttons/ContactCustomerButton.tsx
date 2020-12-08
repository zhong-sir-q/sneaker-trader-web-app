import React, { useState, useEffect } from 'react';

import { ContactButton } from './StyledButton';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ChatControllerInstance from 'api/controllers/ChatController';
import { Input } from 'reactstrap';
import defaultAvatar from 'assets/img/placeholder.jpg';

import { Customer } from '../../../../shared';
import { useAuth } from 'providers/AuthProvider';

import { io } from 'socket.io-client';
let socket = io(`http://localhost:4000`);

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
  const handleShow = () => setShowContact(true);
  const handleClose = () => setShowContact(false);

  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [text, setText] = useState('');
  const [buyerId, setBuyerId] = useState(0);
  const [sellerId, setSellerId] = useState(0);
  const handleChange = async (evt: any) => {
    const data = Object.assign({}, evt);
    setText(data.target.value)
  }
  const handleSubmit = async () => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    const data = {message: text, buyerId, sellerId, userType, time, productId};
    socket.emit("message", data);
    setText('');
  };
  const connectToRoom = () => {
    socket.on("connect", (data: any) => {
      const roomName = `${productId}_${buyerId}_${sellerId}`;
      socket.emit("join", roomName);
    });
    socket.on("newMessage", (data: any) => {
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
      const response = await ChatControllerInstance.getChatByProductIdAndBuyerIDAndSellerId(productId, buyerId, sellerId);
      setMessages(response);
      setInitialized(true);
    }
  };
  const getRooms = async () => {
    const response = {data: []};
    setRooms(response.data);
    setInitialized(true);
  };
  useEffect(() => {
   if (!initialized) {
      getMessages();
      connectToRoom();
      getRooms();
    }
  });

  const { username } = customer;
  return (
    <React.Fragment>
      <ContactButton onClick={handleShow}>{title}</ContactButton>
      <Dialog open={showContact} onClose={handleClose} className="chat-container">
        <DialogTitle>
          {username || 'Anonymous'}
          <span className="close" onClick={handleClose}><i className="fa fa-times-circle"></i></span>
        </DialogTitle>
        <DialogContent>
          {
            (messages && messages.length) ? messages.map(function(item: any, i: any){
              const date = new Date(item.dateTime);
              const newDate = new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
              const offset = date.getTimezoneOffset() / 60;
              const hours = date.getHours();
              newDate.setHours(hours - offset);
              const time = newDate.toLocaleString();
              const splitValue = time.split(' ')[1];
              const splitChatTime = splitValue.split(':');
              const chatTime = `${splitChatTime[0]}: ${splitChatTime[1]}`;

              if (item.userType === userType) {
                return (<div className="message-right">
                  <div className="chat-content-right">{item.message}</div>
                  <div className="profile">
                    <div className='photo' style={{ backgroundColor: 'white' }}>
                      <img className='h-100' src={defaultAvatar} alt='uploaed file' />
                    </div>
                    <span>{chatTime}</span>
                  </div>
                </div>)
              } else {
                return (<div className="message-left">
                  <div className="profile">
                    <div className='photo' style={{ backgroundColor: 'white' }}>
                      <img className='h-100' src={defaultAvatar} alt='uploaed file' />
                    </div>
                    <span>{chatTime}</span>
                  </div>
                  <div className="chat-content-left">{item.message}</div>
                </div>)
              }
            }) : null
          }
        </DialogContent>
        <DialogActions>
          <Input placeholder="Type your message here" value={text} onChange={handleChange}/>
          <i className="send" onClick={handleSubmit}></i>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ContactCustomerButton;
