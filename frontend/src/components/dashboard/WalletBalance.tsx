import React, { useState, useEffect } from 'react';

import { Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';

import StatisticsDisplay from './StatisticsDisplay';

import { getCurrentUser } from 'utils/auth';
import { topupWalletBalance, getWalletBalanceByUserId } from 'api/api';

type TopupWalletDialogProps = {
  handleClose: () => void;
  isOpen: boolean;
};

const TopupWalletDialog = (props: TopupWalletDialogProps) => {
  const [topupAmount, setTopupAmount] = useState<number>();

  const { handleClose, isOpen } = props;

  const onChange = (evt: any) => setTopupAmount(evt.target.value);

  const onTopup = async () => {
    const currentUser = await getCurrentUser();

    await topupWalletBalance({ userId: currentUser.id!, amount: topupAmount! });

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

const WalletBalance = () => {
  const [balance, setBalance] = useState<number>();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) setBalance(await getWalletBalanceByUserId(currentUser.id!));
    })();
  });

  return (
    <React.Fragment>
      <div style={{ cursor: 'pointer' }} onClick={() => handleOpen()}>
        <StatisticsDisplay
          iconColor='icon-success'
          iconName='business_money-coins'
          primaryText={'$' + balance}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={handleClose} />
    </React.Fragment>
  );
};

export default WalletBalance
