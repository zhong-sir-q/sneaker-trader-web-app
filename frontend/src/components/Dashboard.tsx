import React, { useState, useEffect } from 'react';

// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';

import PanelHeader from './PanelHeader';
import TransactionDualHistoryTable from './dashboard/TransactionDualHistoryTable';
import SaleHistoryTable from './dashboard/SaleHistoryTable';

import TransactionTableContextProvider from 'providers/TransactionTableContextProvider';
import ListedSneakerCounts from './dashboard/ListedSneakerCounts';
import UserRankingPoints from './dashboard/UserRankingPoints';
import SoldSneakerCounts from './dashboard/SoldSneakerCounts';
import MonthlyProfit from './dashboard/charts/MonthlyProfit';
import MonthSneakerValue from './dashboard/charts/MonthSneakerValue';
import CenterSpinner from './CenterSpinner';

import { useAuth } from 'providers/AuthProvider';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import WalletBalance from './dashboard/WalletBalance';
import WalletCtxProvider from 'providers/WalletCtxProvider';
import UserControllerInstance from 'api/controllers/UserController';

/**
 * TODO:
 *
 * Graphs
 * - Profit over time (compare to the og purchased price, add it to the listing form)
 * - the value of your sneakers going up or down monthly (Trend)
 */

const Dashboard = () => {
  const [rankingPoints, setRankingPoint] = useState(0);
  const [listedSneakerCounts, setListedSneakerCounts] = useState(0);
  const [completedSaleCounts, setCompletedSaleCounts] = useState(0);

  const { currentUser } = useAuth();

  const onLoaded = async () => {
    if (currentUser) {
      const sellerListedSneakers = await ListedSneakerControllerInstance.getUnsoldListedSneakers(currentUser.id);
      const soldSneakers = await ListedSneakerControllerInstance.getSoldListedSneakers(currentUser.id);
      const userRankingPoints = await UserControllerInstance.getRankingPointsByUserId(currentUser.id);

      setListedSneakerCounts(sellerListedSneakers.length);
      setCompletedSaleCounts(soldSneakers.length);
      setRankingPoint(userRankingPoints);
    }
  };

  useEffect(() => {
    onLoaded();
  });

  return !currentUser ? (
    <CenterSpinner />
  ) : (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Row>
          <Col xs={12} md={12}>
            <Card className='card-stats card-raised'>
              <CardBody>
                <Row>
                  <Col md='3'>
                    <UserRankingPoints rankingPoints={rankingPoints} />
                  </Col>
                  <Col md='3'>
                    <ListedSneakerCounts counts={listedSneakerCounts} />
                  </Col>
                  <Col md='3'>
                    <WalletBalance />
                  </Col>
                  <Col md='3'>
                    <SoldSneakerCounts counts={completedSaleCounts} />
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

const DashboardContainer = () => (
  <WalletCtxProvider>
    <TransactionTableContextProvider>
      <Dashboard />
    </TransactionTableContextProvider>
  </WalletCtxProvider>
);

export default DashboardContainer;
