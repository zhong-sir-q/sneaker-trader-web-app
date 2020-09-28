import React, { useState } from 'react';

import StatisticsDisplay from './StatisticsDisplay';

import { useWalletCtx } from 'providers/WalletCtxProvider';
import TopupWalletDialog from 'components/TopupWalletDialog';

const WalletBalance = () => {
  const [open, setOpen] = useState(false);
  const { walletBalance } = useWalletCtx();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <React.Fragment>
      <div style={{ cursor: 'pointer' }} onClick={() => handleOpen()}>
        <StatisticsDisplay
          iconColor='icon-success'
          iconName='shopping_credit-card'
          primaryText={`$${walletBalance}`}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={handleClose} />
    </React.Fragment>
  );
};

export default WalletBalance;
