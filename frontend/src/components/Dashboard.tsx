import React from 'react';

// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';

import PanelHeader from './PanelHeader';
import WalletBalance from './dashboard/WalletBalance';
import TransactionDualHistoryTable from './dashboard/TransactionDualHistoryTable';
import SaleHistoryTable from './dashboard/SaleHistoryTable';

import TransactionTableContextProvider from 'providers/TransactionTableContextProvider';
import ListedSneakerCounts from './dashboard/ListedSneakerCounts';
import UserRankingPoints from './dashboard/UserRankingPoints';
import SoldSneakerCounts from './dashboard/SoldSneakerCounts';
import MonthlyProfit from './dashboard/charts/MonthlyProfit';
import MonthSneakerValue from './dashboard/charts/MonthSneakerValue';

/**
 * TODO:
 * 
 * Graphs
 * - Profit over time (compare to the og purchased price, add it to the listing form)
 * - the value of your sneakers going up or down monthly (Trend)
 */

const Dashboard = () => {
  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Row>
          <Col xs={12} md={12}>
            <Card className='card-stats card-raised'>
              <CardBody>
                <Row>
                  <Col md='3'>
                    <UserRankingPoints />
                  </Col>
                  <Col md='3'>
                    <ListedSneakerCounts />
                  </Col>
                  <Col md='3'>
                    <WalletBalance />
                  </Col>
                  <Col md='3'>
                    <SoldSneakerCounts />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <MonthlyProfit />
          </Col>
          <Col xs={12} md={6}>
            <MonthSneakerValue />
          </Col>
        </Row>
        <Row>
          <TransactionTableContextProvider>
            <Col xs={12} md={12}>
              <TransactionDualHistoryTable />
            </Col>
            <Col xs={12} md={12}>
              <SaleHistoryTable />
            </Col>
          </TransactionTableContextProvider>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
