import React, { useState, useEffect } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core';
import ChatControllerInstance from 'api/controllers/ChatController';
import { Input } from 'reactstrap';
import defaultAvatar from 'assets/img/placeholder.jpg';

import { Customer } from '../../../../shared';
import { useAuth } from 'providers/AuthProvider';

import { io } from 'socket.io-client';
import useScrollBottom from 'hooks/useScrollBottom';

const socket = io(process.env.REACT_APP_API_SERVER as string);

type ChatDialogProps = {
  customer: Customer;
  productId: number;
  userId: number;
  userType: string;
  open: boolean;
  onClose: () => void;
};

// TODO: use moment to take care time calculation
// const chatTime = moment(item.dateTime).format('h:mm')
const formatChatTime = (dateTime: number) => {
  const date = new Date(dateTime);
  const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();
  newDate.setHours(hours - offset);
  const time = newDate.toLocaleString();
  const splitValue = time.split(' ')[1];
  const splitChatTime = splitValue.split(':');
  const chatTime = `${splitChatTime[0]}: ${splitChatTime[1]}`;

  return chatTime;
};

const ChatDialog = (props: ChatDialogProps) => {
  const { open, customer, productId, userId, userType, onClose } = props;
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const [text, setText] = useState('');

  const [messages, setMessages] = useState<any[]>();
  const [messageEndRef, scrollToMessageEnd] = useScrollBottom(messages);

  const [unreadMessageIds, setUnreadMessageIds] = useState<number[]>([]);

  const handleChange = (evt: any) => setText(evt.target.value);

  const buyerId = userType === 'seller' ? customer.id : currentUser.id;
  const sellerId = userType === 'buyer' ? userId : currentUser.id;

  const handleSubmit = () => {
    if (text.trim() === '') return;

    const data = { message: text.trim(), buyerId, sellerId, userType, productId, dateTime: formatChatTime(Date.now()) };
    socket.emit('message', data);
    setText('');
  };

  const handleClose = async () => {
    if (unreadMessageIds.length) await ChatControllerInstance.updateStatus(unreadMessageIds, 'read');

    onClose();
  };

  const getMessages = async () => {
    if (currentUser) {
      const response = await ChatControllerInstance.getChatByProductIdAndBuyerIDAndSellerId(
        productId,
        buyerId,
        sellerId
      );

      if (response) setMessages(response);

      if (response && response.length) {
        const chatIds: Array<number> = [];

        for (const entry of response) {
          if (entry.status === 'unread' && entry.userType !== userType) {
            chatIds.push(entry.id);
          }
        }

        setUnreadMessageIds(chatIds);
      }

      scrollToMessageEnd();
    }
  };

  useEffect(() => {
    getMessages();
  }, [productId, sellerId, buyerId]);

  useEffect(() => {
    socket.on(`newMessage_${productId}_${buyerId}_${sellerId}`, () => {
      getMessages();
    });
  }, []);

  const { username } = customer;

  // important to use message-right, so it will occur at the bottom of the message list, so
  // scollIntoView will reach the bottom of the chatbox
  const MessageEnd = () => <div className='message-right' ref={messageEndRef} />;

  const classes = useMuiStyles();

  return (
    <Dialog
      open={open}
      className='chat-container'
      classes={{
        paperWidthSm: classes.paperWidthSm,
      }}
    >
      <DialogTitle
        classes={{
          root: classes.dialogTitle,
        }}
      >
        {username || 'Anonymous'}
        <span className='close' onClick={handleClose}>
          <i className='fa fa-times-circle'></i>
        </span>
      </DialogTitle>
      <DialogContent
        classes={{
          root: classes.dialogContent,
        }}
      >
        {messages &&
          messages.length > 0 &&
          messages.map(function (item: any, idx: any) {
            const chatTime = formatChatTime(item.dateTime);

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
      <DialogActions
        classes={{
          root: classes.dialogActions,
        }}
      >
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
  );
};

const useMuiStyles = makeStyles(() => ({
  dialogTitle: {
    backgroundColor: '#F7F9FA',
    padding: '10px 20px',
  },
  dialogActions: {
    backgroundColor: '#EBEBEB',
  },
  dialogContent: {
    padding: '8px',
  },
  paperWidthSm: {
    height: '460px',
    width: '460px',
  },
}));

export default ChatDialog;
