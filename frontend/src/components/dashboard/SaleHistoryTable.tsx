import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import TransactionTable from './TransactionTable';
import { useTransactionTableContext } from 'providers/TransactionTableContextProvider';

const SaleHistoryTable = () => {
  const { sellerSoldSneakers } = useTransactionTableContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Sales History</CardTitle>
      </CardHeader>
      <CardBody>
        <TransactionTable sneakers={sellerSoldSneakers} showListed={true} />
      </CardBody>
    </Card>
  );
};

export default SaleHistoryTable;
