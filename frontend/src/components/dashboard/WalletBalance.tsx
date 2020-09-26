import React, { useState } from 'react';

import { Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';

import StatisticsDisplay from './StatisticsDisplay';

import { topupWalletBalance } from 'api/api';
import { useAuth } from 'providers/AuthProvider';

type TopupWalletDialogProps = {
  handleClose: () => void;
  isOpen: boolean;
};

const TopupWalletDialog = (props: TopupWalletDialogProps) => {
  const [topupAmount, setTopupAmount] = useState<number>();
  const { currentUser } = useAuth();

  const { handleClose, isOpen } = props;

  const onChange = (evt: any) => setTopupAmount(evt.target.value);

  const onTopup = async () => {
    if (currentUser) await topupWalletBalance({ userId: currentUser.id, amount: topupAmount! });

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

type WalletBalanceProps = {
  balance: number;
};

const WalletBalance = (props: WalletBalanceProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <React.Fragment>
      <div style={{ cursor: 'pointer' }} onClick={() => handleOpen()}>
        <StatisticsDisplay
          iconColor='icon-success'
          iconName='shopping_credit-card'
          primaryText={`$${props.balance}`}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={handleClose} />
    </React.Fragment>
  );
};

export default WalletBalance;
