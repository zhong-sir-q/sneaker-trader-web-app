import React from 'react';

// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';

import PanelHeader from './PanelHeader';
import WalletBalance from './dashboard/WalletBalance';
import TransactionDualHistoryTable from './dashboard/TransactionDualHistoryTable';
import SaleHistoryTable from './dashboard/SaleHistoryTable';

import TransactionTableContextProvider from 'providers/TransactionTableContextProvider';
import StatisticsDisplay from './dashboard/StatisticsDisplay';

/**
 * TODO:
 *
 * Static display
 * - numbers of listed sneakers
 * - ranking points
 * - current wallet balance
 * - Number of sales
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
                    {/* get the no. of listed sneakers, excluding sold */}
                    <StatisticsDisplay
                      iconColor='icon-success'
                      iconName='business_money-coins'
                      primaryText={25}
                      secondaryText='No. of Listed Sneakers'
                    />
                  </Col>
                  <Col md='3'>
                    {/* get the ranking points of the current user */}
                    <StatisticsDisplay
                      iconColor='icon-success'
                      iconName='business_money-coins'
                      primaryText={25}
                      secondaryText='Ranking Points'
                    />
                  </Col>
                  <Col md='3'>
                    <WalletBalance />
                  </Col>
                  <Col md='3'>
                    {/* get no. of sneakers sold */}
                    <StatisticsDisplay
                      iconColor='icon-success'
                      iconName='business_money-coins'
                      primaryText={25}
                      secondaryText='No. of Sales'
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
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
