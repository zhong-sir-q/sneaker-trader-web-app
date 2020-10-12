import React from 'react';

// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';

import PanelHeader from './PanelHeader';
import TransactionDualHistoryTable from './dashboard/TransactionDualHistoryTable';
import SaleHistoryTable from './dashboard/SaleHistoryTable';

import ListedSneakerCounts from './dashboard/ListedSneakerCounts';
import UserRankingPoints from './dashboard/UserRankingPoints';
import SoldSneakerCounts from './dashboard/SoldSneakerCounts';
import MonthlyProfit from './dashboard/charts/MonthlyProfit';
import MonthSneakerValue from './dashboard/charts/MonthSneakerValue';
import CenterSpinner from './CenterSpinner';

import WalletBalance from './dashboard/WalletBalance';
import { useUserStatsCtx } from 'providers/marketplace/UserStatsCtxProvider';

/**
 * TODO:
 *
 * Graphs
 * - Profit over time (compare to the og purchased price, add it to the listing form)
 * - the value of your sneakers going up or down monthly (Trend)
 */

const Dashboard = () => {
  const { rankingPoints, listedSneakerCounts, completedSaleCounts } = useUserStatsCtx();

  // check against undefined, because if if any of the value is 0, then it will render the spinner forever
  return rankingPoints === undefined || listedSneakerCounts === undefined || completedSaleCounts === undefined ? (
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
          <Col xs={12} md={12}>
            <TransactionDualHistoryTable />
          </Col>
          <Col xs={12} md={12}>
            <SaleHistoryTable />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
