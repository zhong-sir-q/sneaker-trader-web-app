import React from 'react';

import { Dialog } from '@material-ui/core';
import { Alert } from 'reactstrap';

type AlertDialogProps = {
  open: boolean;
  color: string;
  message: string;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const AlertDialog = (props: AlertDialogProps) => {
  const { open, color, message, maxWidth, onClose } = props;

  return (
    <Dialog fullWidth maxWidth={maxWidth || 'xs'} open={open} onClose={onClose}>
      {/* hide the tiny bit of offset */}
      <Alert className='no-margin' style={{ overflow: 'hidden' }} color={color} toggle={onClose}>
        {message}
      </Alert>
    </Dialog>
  );
};

export default AlertDialog;
