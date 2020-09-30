import React from 'react';
import { Button } from 'reactstrap';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';
import onDeleteUser from 'usecases/onDeleteUser';
import { HOME } from 'routes';

const DeleteAccountButton = () => {
  const [open, setOpen] = React.useState(false);
  const { currentUser } = useAuth();
  const history = useHistory();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onConfirmDelete = async () => {
    await onDeleteUser(currentUser!.username);
    await signOut(history, HOME);
    handleClose();
  };

  return (
    <div>
      <Button style={{ width: '100%' }} onClick={handleClickOpen} color='danger'>
        Delete Account
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Do you want to delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will remove ALL your personal data</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onConfirmDelete} color='danger'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteAccountButton;
