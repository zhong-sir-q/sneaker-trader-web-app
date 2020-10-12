import React from 'react';

import StatisticsDisplay from './StatisticsDisplay';

import { useWalletCtx } from 'providers/WalletCtxProvider';
import TopupWalletDialog from 'components/TopupWalletDialog';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

const WalletBalance = () => {
  const { walletBalance } = useWalletCtx();

  const { open, onOpen, onClose } = useOpenCloseComp()

  return (
    <React.Fragment>
      <div style={{ cursor: 'pointer' }} onClick={onOpen}>
        <StatisticsDisplay
          iconColor='icon-success'
          iconName='shopping_credit-card'
          primaryText={`$${walletBalance}`}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={onClose} />
    </React.Fragment>
  );
};

export default WalletBalance;
