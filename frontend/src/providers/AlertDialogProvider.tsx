import React, { createContext, ReactNode, useContext } from 'react';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import AlertDialog from 'components/AlertDialog';

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
  const { color, msg } = props;

  return (
    <AlertComponentCtx.Provider value={{ onOpenAlert: onOpen }}>
      <AlertDialog {...{ open, color, msg, onClose }} />
      {props.children}
    </AlertComponentCtx.Provider>
  );
};

export default AlertDialogProvider;
