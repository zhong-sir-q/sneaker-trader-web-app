import React from 'react';

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';

import jacket from 'assets/img/saint-laurent.jpg';
import shirt from 'assets/img/balmain.jpg';
import swim from 'assets/img/prada.jpg';
import PanelHeader from './PanelHeader';

const Dashboard = () => {
  return (
    <React.Fragment>
      <PanelHeader size='lg' content={undefined} />
      <div className='content'>
        <Row>
          <Col xs={12} md={12}>
            <Card className='card-stats card-raised'>
              <CardBody>
                <Row>
                  <Col md='3'>
                    <div className='statistics'>
                      <div className='info'>
                        <div className='icon icon-primary'>
                          <i className='now-ui-icons ui-2_chat-round' />
                        </div>
                        <h3 className='info-title'>859</h3>
                        <h6 className='stats-title'>Messages</h6>
                      </div>
                    </div>
                  </Col>
                  <Col md='3'>
                    <div className='statistics'>
                      <div className='info'>
                        <div className='icon icon-success'>
                          <i className='now-ui-icons business_money-coins' />
                        </div>
                        <h3 className='info-title'>
                          <small>$</small>
                          3,521
                        </h3>
                        <h6 className='stats-title'>Today Revenue</h6>
                      </div>
                    </div>
                  </Col>
                  <Col md='3'>
                    <div className='statistics'>
                      <div className='info'>
                        <div className='icon icon-info'>
                          <i className='now-ui-icons users_single-02' />
                        </div>
                        <h3 className='info-title'>562</h3>
                        <h6 className='stats-title'>Customers</h6>
                      </div>
                    </div>
                  </Col>
                  <Col md='3'>
                    <div className='statistics'>
                      <div className='info'>
                        <div className='icon icon-danger'>
                          <i className='now-ui-icons objects_support-17' />
                        </div>
                        <h3 className='info-title'>353</h3>
                        <h6 className='stats-title'>Support Requests</h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag='h4'>Best Selling Products</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive className='table-shopping'>
                  <thead>
                    <tr>
                      <th className='text-center' />
                      <th>PRODUCT</th>
                      <th>COLOR</th>
                      <th>Size</th>
                      <th className='text-right'>PRICE</th>
                      <th className='text-right'>QTY</th>
                      <th className='text-right'>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className='img-container'>
                          <img src={jacket} alt='...' />
                        </div>
                      </td>
                      <td className='td-name'>
                        <a href='#jacket'>Suede Biker Jacket</a>
                        <br />
                        <small>by Saint Laurent</small>
                      </td>
                      <td>Black</td>
                      <td>M</td>
                      <td className='td-number'>
                        <small>€</small>3,390
                      </td>
                      <td className='td-number'>1</td>
                      <td className='td-number'>
                        <small>€</small>549
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='img-container'>
                          <img src={shirt} alt='...' />
                        </div>
                      </td>
                      <td className='td-name'>
                        <a href='#shirt'>Jersey T-Shirt</a>
                        <br />
                        <small>by Balmain</small>
                      </td>
                      <td>Black</td>
                      <td>M</td>
                      <td className='td-number'>
                        <small>€</small>499
                      </td>
                      <td className='td-number'>2</td>
                      <td className='td-number'>
                        <small>€</small>998
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='img-container'>
                          <img src={swim} alt='...' />
                        </div>
                      </td>
                      <td className='td-name'>
                        <a href='#pants'>Slim-Fit Swim Short </a>
                        <br />
                        <small>by Prada</small>
                      </td>
                      <td>Red</td>
                      <td>M</td>
                      <td className='td-number'>
                        <small>€</small>200
                      </td>
                      <td className='td-number'>3</td>
                      <td className='td-number'>
                        <small>€</small>799
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} />
                      <td className='td-total'>Total</td>
                      <td className='td-price'>
                        <small>€</small>2,346
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
