import React from 'react';

import { Dialog, DialogTitle, Switch } from '@material-ui/core';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import { useTransactionTableContext } from 'providers/TransactionTableContextProvider';
import ListedSneakerTable from './ListedSneakerTable';
import PurchasedSneakerTable from './PurchasedSneakerTable';

const TransactionDualHistoryTable = () => {
  const {
    showListed,
    unsoldListedSneakers,
    purchasedSneakers,
    isOpenSaleSuccessPopup,
    isFetchingTransactions,
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
          {showListed ? (
            <ListedSneakerTable
              isFetchingData={isFetchingTransactions}
              sneakers={unsoldListedSneakers}
              setShowCompleteSaleSuccess={handleOpenPopup}
            />
          ) : (
            <PurchasedSneakerTable sneakers={purchasedSneakers} />
          )}
        </CardBody>
      </Card>
      <Dialog open={isOpenSaleSuccessPopup} onClose={handleClosePopup}>
        <DialogTitle>Congratulations! You have closed the deal!</DialogTitle>
      </Dialog>
    </React.Fragment>
  );
};

export default TransactionDualHistoryTable;
