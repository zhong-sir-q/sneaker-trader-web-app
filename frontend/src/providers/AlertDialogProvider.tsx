import React, { createContext, ReactNode, useContext } from 'react';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { Alert } from 'reactstrap';
import { Dialog } from '@material-ui/core';

type AlertComponentType = {
  onOpenAlert: () => void;
};

const INIT_CTX: AlertComponentType = {
  onOpenAlert: () => {
    throw new Error('Must override!');
  },
};

const AlertComponentCtx = createContext(INIT_CTX);

export const useAlertComponent = () => useContext(AlertComponentCtx);

// uses the Reactstrap Alert Component
const AlertDialogProvider = (props: { children: ReactNode; color: string; msg: string }) => {
  const { open, onOpen, onClose } = useOpenCloseComp();

  return (
    <AlertComponentCtx.Provider value={{ onOpenAlert: onOpen }}>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={onClose}>
        <Alert className='no-margin' color={props.color} toggle={onClose}>
          {props.msg}
        </Alert>
      </Dialog>
      {props.children}
    </AlertComponentCtx.Provider>
  );
};

export default AlertDialogProvider;
