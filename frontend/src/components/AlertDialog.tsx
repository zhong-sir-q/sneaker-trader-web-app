import React from 'react';

import { Dialog, makeStyles } from '@material-ui/core';
import { Alert } from 'reactstrap';

type AlertDialogProps = {
  open: boolean;
  color: string;
  message: string;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const useStyles = makeStyles(() => ({
  dialog: {
    margin: 0,
  },
}));

const AlertDialog = (props: AlertDialogProps) => {
  const { open, color, message, maxWidth, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog className={classes.dialog} fullWidth maxWidth={maxWidth || 'xs'} open={open} onClose={onClose}>
      {/* hide the tiny bit of offset */}
      <Alert style={{ overflow: 'hidden', margin: 0 }} color={color} toggle={onClose}>
        {message}
      </Alert>
    </Dialog>
  );
};

export default AlertDialog;
