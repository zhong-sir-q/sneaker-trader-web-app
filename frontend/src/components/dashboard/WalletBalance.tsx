import React from 'react';

import StatisticsDisplay from './StatisticsDisplay';

import TopupWalletDialog from 'components/TopupWalletDialog';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

type WalletBalanceProps = {
  balance: number;
};

const WalletBalance = (props: WalletBalanceProps) => {
  const { open, onOpen, onClose } = useOpenCloseComp();

  return (
    <React.Fragment>
      <div style={{ cursor: 'pointer' }} onClick={onOpen}>
        <StatisticsDisplay
          iconColor='icon-success'
          iconName='shopping_credit-card'
          primaryText={`$${props.balance}`}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={onClose} />
    </React.Fragment>
  );
};

export default WalletBalance;
