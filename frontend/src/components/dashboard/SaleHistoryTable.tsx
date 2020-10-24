import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import ListedSneakerTable from './ListedSneakerTable';

import { useTransactionTableContext } from 'providers/TransactionTableProvider';
import CenterSpinner from 'components/CenterSpinner';

const SaleHistoryTable = () => {
  const { sellerSoldSneakers } = useTransactionTableContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Sales History</CardTitle>
      </CardHeader>
      <CardBody>
        {!sellerSoldSneakers ? <CenterSpinner /> : <ListedSneakerTable sneakers={sellerSoldSneakers} />}
      </CardBody>
    </Card>
  );
};

export default SaleHistoryTable;
