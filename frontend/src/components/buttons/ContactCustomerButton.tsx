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
  sellerId: number;
};

const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
  const [showContact, setShowContact] = useState(false);

  const { customer, title, productId, sellerId } = props;
  const { currentUser } = useAuth();
  const handleShow = () => setShowContact(true);
  const handleClose = () => setShowContact(false);

  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [text, setText] = useState('');
  const handleChange = async (evt: any) => {
    const data = Object.assign({}, evt);
    setText(data.target.value)
  }
  const handleSubmit = async () => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    const userType = currentUser?.username === customer.username ? 'seller' : 'buyer';
    const data = {message: text, buyerId: currentUser?.id, sellerId, userType, time, productId};
    socket.emit("message", data);
    setText('');
  };
  const connectToRoom = () => {
    socket.on("connect", (data: any) => {
      socket.emit("join", 'test');
    });
    socket.on("newMessage", (data: any) => {
      getMessages();
    });
    setInitialized(true);
  };
  const getMessages = async () => {
    const buyerId = currentUser?.id;
    if (buyerId) {
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
            messages.map(function(item: any, i: any){
              if (currentUser?.id && item.buyerId === currentUser.id && item.productId === productId && item.sellerId === sellerId) {
                if (currentUser?.id && (currentUser.id === item.sellerId || currentUser.id === item.buyerId)) {
                  return (<div className="message-right">
                    <div className="chat-content-right">{item.message}</div>
                    <div className="profile">
                      <div className='photo' style={{ backgroundColor: 'white' }}>
                        <img className='h-100' src={defaultAvatar} alt='uploaed file' />
                      </div>
                      <span>{item.time}</span>
                    </div>
                  </div>)
                } else {
                  return (<div className="message-left">
                    <div className="profile">
                      <div className='photo' style={{ backgroundColor: 'white' }}>
                        <img className='h-100' src={defaultAvatar} alt='uploaed file' />
                      </div>
                      <span>{item.time}</span>
                    </div>
                    <div className="chat-content-left">{item.message}</div>
                  </div>)
                }
              }
            })
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
