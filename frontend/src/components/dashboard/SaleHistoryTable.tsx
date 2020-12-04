import React from 'react';
import { Skeleton } from '@material-ui/lab';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import ListedSneakerTable from './ListedSneakerTable';

import { useTransactionTableContext } from 'providers/TransactionTableProvider';

const SaleHistoryTable = () => {
  const { sellerSoldSneakers } = useTransactionTableContext();

  if (!sellerSoldSneakers) return <Skeleton height={500} />;

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
