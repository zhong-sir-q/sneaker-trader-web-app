import React, { useState } from 'react';
import { Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';

import { useWalletCtx } from 'providers/WalletCtxProvider';
import { useAuth } from 'providers/AuthProvider';

import WalletControllerInstance from 'api/controllers/WalletController';

type TopupWalletDialogProps = {
  handleClose: () => void;
  isOpen: boolean;
};

const TopupWalletDialog = (props: TopupWalletDialogProps) => {
  const [topupAmount, setTopupAmount] = useState<number>();
  const { goFetchBalance } = useWalletCtx();
  const { currentUser } = useAuth();

  const { handleClose, isOpen } = props;

  const onChange = (evt: any) => setTopupAmount(evt.target.value);

  // use case
  const onTopup = async () => {
    await WalletControllerInstance.topup(currentUser!.id, topupAmount!);
    goFetchBalance();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Topup Wallet</DialogTitle>
      <DialogContent>
        <TextField
          inputProps={{ onChange }}
          autoFocus
          margin='dense'
          name='topupAmount'
          label='Amount'
          type='number'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button disabled={!topupAmount || topupAmount <= 0} onClick={onTopup} color='primary'>
          Topup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TopupWalletDialog
