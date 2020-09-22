import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import ListedSneakerTable from './ListedSneakerTable';

import { useTransactionTableContext } from 'providers/TransactionTableContextProvider';

const SaleHistoryTable = () => {
  const { sellerSoldSneakers } = useTransactionTableContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Sales History</CardTitle>
      </CardHeader>
      <CardBody>
        <ListedSneakerTable sneakers={sellerSoldSneakers} />
      </CardBody>
    </Card>
  );
};

export default SaleHistoryTable;
