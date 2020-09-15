import React, { useState, useEffect } from 'react';

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Button } from 'reactstrap';

import { DialogTitle, Dialog, DialogContent, TextField, DialogActions } from '@material-ui/core';

import PanelHeader from './PanelHeader';
import { getWalletBalanceByUserId, topupWalletBalance } from 'api/api';
import { getCurrentUser } from 'utils/auth';
import { Sneaker } from '../../../shared';

type StatisticsDisplayProps = {
  iconColor: string;
  iconName: string;
  primaryText: string | number;
  secondaryText: string | number;
};

const StatisticsDisplay = (props: StatisticsDisplayProps) => {
  const { iconColor, iconName, primaryText, secondaryText } = props;

  return (
    <div className='statistics'>
      <div className='info'>
        <div className={`icon ${iconColor}`}>
          <i className={`now-ui-icons ${iconName}`} />
        </div>
        <h3 className='info-title'>{primaryText}</h3>
        <h6 className='stats-title'>{secondaryText}</h6>
      </div>
    </div>
  );
};

type TopupWalletDialogProps = {
  handleClose: () => void;
  isOpen: boolean;
};

const TopupWalletDialog = (props: TopupWalletDialogProps) => {
  const [topupAmount, setTopupAmount] = useState<number>();

  const { handleClose, isOpen } = props;

  const onChange = (evt: any) => setTopupAmount(evt.target.value);

  const onTopup = async () => {
    const currentUser = await getCurrentUser();

    await topupWalletBalance({ userId: currentUser.id!, amount: topupAmount! });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Topup Wallet</DialogTitle>
      <DialogContent>
        <TextField
          inputProps={{ onChange }}
          autoFocus
          margin='dense'
          name='topupAmount'
          label='Amount'
          type='number'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button disabled={!topupAmount || topupAmount <= 0} onClick={onTopup} color='primary'>
          Topup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const WalletBalance = () => {
  const [balance, setBalance] = useState<number>();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) setBalance(await getWalletBalanceByUserId(currentUser.id!));
    })();
  });

  return (
    <React.Fragment>
      <div style={{ cursor: 'pointer' }} onClick={() => handleOpen()}>
        <StatisticsDisplay
          iconColor='icon-success'
          iconName='business_money-coins'
          primaryText={'$' + (balance ? balance : 0)}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={handleClose} />
    </React.Fragment>
  );
};

const mockListedProducts = [
  {
    id: 9,
    name: 'kd 9 elite',
    brand: 'Nike',
    size: 8,
    colorway: 'Black',
    RRP: 345,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/d543bf97f60483f82824ba6691478e9f',
  },
  {
    id: 11,
    name: 'AJ 1 Retro',
    brand: 'Air Jordan',
    size: 1,
    colorway: 'Red and White',
    RRP: 400,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/72361fa2804ee8416d7d3a771cd0e3f3',
  },
  {
    id: 13,
    name: 'Kobe 14',
    brand: 'Nike',
    size: 12,
    colorway: 'Black',
    RRP: 600,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
  },
  {
    id: 14,
    name: 'Kobe 14',
    brand: 'Nike',
    size: 10,
    colorway: 'Black',
    RRP: 400,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
  },
];

const mockBoughtProducts = [
  {
    id: 15,
    name: 'Jordan 1',
    brand: 'Nike',
    size: 9,
    colorway: 'Bred',
    RRP: 800,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/79ee5ea2a9d6e1591c95a985a1b0c55f',
  },
  {
    id: 16,
    name: 'Air Max 270',
    brand: 'Nike',
    size: 10,
    colorway: 'White',
    RRP: 270,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/30bf7e22ef82729b002188ae0a7bd493',
  },
  {
    id: 8,
    name: 'Stephen Curry 4',
    brand: 'Under Armor',
    size: 12,
    colorway: 'White and black',
    RRP: 225,
    description: '',
    serialNumber: null,
    imageUrls:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/c40940c03e7f3be51b6dbe1a7557f338',
  },
];

const TransactionHistory = () => {
  const [items, setItems] = useState(mockListedProducts);
  const [showListed, setShowListed] = useState(true);

  const toggle = () => {
    setShowListed(!showListed)
    if (showListed) setItems(mockBoughtProducts)
    else setItems(mockListedProducts)
  }

  const TransactionHeader = () => (
    <thead>
      <tr>
        <th className='text-center' />
        <th>PRODUCT</th>
        <th>COLOR</th>
        <th>Size</th>
        {showListed ? <th>Status</th> : null}
        <th className='text-right'>PRICE</th>
        <th className='text-right'>QTY</th>
        <th className='text-right'>AMOUNT</th>
      </tr>
    </thead>
  );

  const TransactionRow = (props: { sneaker: Sneaker }) => {
    const { name, colorway, imageUrls, size, price, quantity, RRP } = props.sneaker;

    const displayImg = imageUrls.split(',')[0];

    return (
      <tr>
        <td>
          <div className='img-container'>
            <img src={displayImg} alt={name + colorway} />
          </div>
        </td>
        <td className='td-name'>
          <span>{name}</span>
          <br />
          <small>by Balmain</small>
        </td>
        <td>{colorway}</td>
        <td>{size}</td>
        {/* NOTE: hard-coded value */}
        {showListed ? <td>Unsold</td> : null}
        <td className='td-number'>
          <small>$</small>
          {RRP || price}
        </td>
        <td className='td-number'>{quantity || 1}</td>
        <td className='td-number'>
          <small>$</small>
          {quantity || 1 * (RRP || Number(price))}
        </td>
      </tr>
    );
  };

  const computeTotalAmount = (sneakers: Sneaker[]) => {
    let total = 0;
    for (const s of sneakers) total += s.quantity || 1 * (s.RRP || Number(s.price));

    return total;
  };

  const TransactionTable = () => (
    <Table responsive className='table-shopping'>
      <TransactionHeader />
      <tbody>
        {items.map((sneaker) => (
          <TransactionRow sneaker={sneaker} />
        ))}
        <tr>
          <td colSpan={showListed ? 6 : 5} />
          <td className='td-total'>Total</td>
          <td className='td-price'>
            <small>$</small>
            {computeTotalAmount(items)}
          </td>
        </tr>
      </tbody>
    </Table>
  );

  return (
    <Card>
      <CardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardTitle tag='h4'>{showListed ? 'Listed Products' : 'Bought Products'}</CardTitle>
        <Button color='primary' onClick={toggle}>{showListed ? 'Show Bought' : 'Show Listed'}</Button>
      </CardHeader>
      <CardBody>
        <TransactionTable />
      </CardBody>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <React.Fragment>
      <PanelHeader size='sm' content={undefined} />
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
