import React from 'react';

// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';

import PanelHeader from './PanelHeader';
import WalletBalance from './dashboard/WalletBalance';
import TransactionHistory from './dashboard/TransactionHistory';

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
                    <WalletBalance />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <TransactionHistory />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
