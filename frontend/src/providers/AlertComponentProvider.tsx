import React, { createContext, ReactNode, useContext, useState } from 'react';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { Alert } from 'reactstrap';
import { Dialog } from '@material-ui/core';

type AlertComponentType = {
  onOpenAlert: (color?: string, message?: string) => void;
};

const INIT_CTX: AlertComponentType = {
  onOpenAlert: () => {
    throw new Error('Must override!');
  },
};

const AlertComponentCtx = createContext(INIT_CTX);

export const useAlertComponent = () => useContext(AlertComponentCtx);

// uses the Reactstrap Alert Component
const AlertComponentProvider = (props: { children: ReactNode; color: string; message: string }) => {
  const { open, onOpen, onClose } = useOpenCloseComp();
  const [color, setColor] = useState<string>(props.color);
  const [alertMsg, setAlertMsg] = useState<string>(props.message);

  const onOpenAlert = (color?: string, message?: string) => {
    if (color) setColor(color);
    if (message) setAlertMsg(message);
    onOpen();
  };

  return (
    <AlertComponentCtx.Provider value={{ onOpenAlert }}>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={onClose}>
        <Alert className='no-margin' color={color} toggle={onClose}>
          {alertMsg}
        </Alert>
      </Dialog>
      {props.children}
    </AlertComponentCtx.Provider>
  );
};

export default AlertComponentProvider;
