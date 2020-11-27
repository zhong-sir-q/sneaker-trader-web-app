import React from 'react';

import { Dialog } from '@material-ui/core';
import { Alert } from 'reactstrap';

type AlertDialogProps = {
  open: boolean;
  color: string;
  msg: string;
  onClose: () => void;
};

const AlertDialog = (props: AlertDialogProps) => {
  const { open, color, msg, onClose } = props;

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={onClose}>
      <Alert className='no-margin' color={color} toggle={onClose}>
        {msg}
      </Alert>
    </Dialog>
  );
};

export default AlertDialog;
