import React, { useState } from 'react';
import { Dialog, TextField, DialogTitle, DialogContent } from '@material-ui/core';

import { useWalletCtx } from 'providers/WalletProvider';
import { useAuth } from 'providers/AuthProvider';

import WalletControllerInstance from 'api/controllers/WalletController';
import StripePaymentCheckout from './stripe/StripePaymentCheckout';

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
    <Dialog fullWidth maxWidth='xs' open={isOpen} onClose={handleClose}>
      <DialogTitle>Topup Wallet</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '12px' }}>
          <TextField
            inputProps={{ onChange }}
            autoFocus
            margin='dense'
            name='topupAmount'
            label='Amount'
            type='number'
            fullWidth
          />
        </div>
        <StripePaymentCheckout
          dollarAmountToCharge={Number(topupAmount) || 0}
          title={`Topup Amount: $${Number(topupAmount) || 0}`}
          onConfirmPayment={onTopup}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TopupWalletDialog;
