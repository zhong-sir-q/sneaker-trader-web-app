import React from 'react';

import { Dialog, DialogTitle, Switch } from '@material-ui/core';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import TransactionTable from './TransactionTable';

import { useTransactionTableContext } from 'providers/TransactionTableContextProvider';

const TransactionDualHistoryTable = () => {
  const {
    showListed,
    dualHistoryTableSneakers,
    isOpenSaleSuccessPopup,
    handleOpenPopup,
    handleClosePopup,
    toggleShowListed,
  } = useTransactionTableContext();

  return (
    <React.Fragment>
      <Card>
        <CardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CardTitle tag='h4'>{showListed ? 'Listed Products' : 'Purchased Products'}</CardTitle>
          <div>
            Listed
            <Switch checked={!showListed} onChange={toggleShowListed} color='default' />
            Purchased
          </div>
        </CardHeader>
        <CardBody>
          <TransactionTable
            sneakers={dualHistoryTableSneakers!}
            showListed={showListed}
            setShowCompleteSaleSuccess={handleOpenPopup}
          />
        </CardBody>
      </Card>
      <Dialog open={isOpenSaleSuccessPopup} onClose={handleClosePopup}>
        <DialogTitle>Congratulations! You have closed the deal!</DialogTitle>
      </Dialog>
    </React.Fragment>
  );
};

export default TransactionDualHistoryTable;
