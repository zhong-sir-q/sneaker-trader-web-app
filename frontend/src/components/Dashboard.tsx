import React, { useState, useEffect } from 'react';

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Button, Input } from 'reactstrap';

import { DialogTitle, Dialog, DialogContent, TextField, DialogActions, Switch } from '@material-ui/core';

import styled from 'styled-components';

import PanelHeader from './PanelHeader';
import {
  getWalletBalanceByUserId,
  topupWalletBalance,
  getListedProductsBySellerId,
  getBoughtProductsByBuyerId,
  rateBuyer,
  rateSeller,
  updateProdStatus,
} from 'api/api';
import { getCurrentUser } from 'utils/auth';
import { Sneaker, Customer, SneakerStatus } from '../../../shared';

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
          primaryText={'$' + balance}
          secondaryText='Wallet Balance'
        />
      </div>
      <TopupWalletDialog isOpen={open} handleClose={handleClose} />
    </React.Fragment>
  );
};

const CustomButton = styled(Button)`
  font-size: 11px;
  padding: 5px 10px;
`;

const ContactButton = styled(CustomButton)`
  background-color: #1e90ff;
`;

const CompleteSaleButton = styled(CustomButton)`
  background-color: #008000;
`;

const RatingButton = styled(CustomButton)`
  cursor: pointer;
`;

type LeaveReviewProps = {
  title: string;
  listedProductId: number;
  rateUser: (listedProductId: number, rating: number) => Promise<void>;
};

const LeaveReview = (props: LeaveReviewProps) => {
  const [open, setOpen] = React.useState(false);

  const [rating, setRating] = useState<number>(1);

  const onSelectRating = (evt: any) => setRating(evt.target.value);

  const { title, listedProductId, rateUser } = props;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onConfirm = async () => {
    await rateUser(listedProductId, Number(rating));
    handleClose();
  };

  return (
    <div>
      <RatingButton color='primary' onClick={handleClickOpen}>
        {title}
      </RatingButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Input onChange={onSelectRating} type='select'>
            {Array(10)
              .fill(0)
              .map((_, idx) => (
                <option value={idx + 1} key={idx}>
                  {idx + 1}
                </option>
              ))}
          </Input>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onConfirm} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// TODO: this should be a separate component on its own
const TransactionHistory = () => {
  const [items, setItems] = useState<Sneaker[]>();
  // the state type is defined in the api already
  const [listedProducts, setListedProducts] = useState<Sneaker[]>();
  const [boughtProducts, setBoughtProducts] = useState<Sneaker[]>();

  const [showSaleSuccess, setShowCompleteSaleSuccess] = useState(false);
  const [showListed, setShowListed] = useState(true);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      const currUserId = currentUser.id!;

      const fetchedListedProducts = await getListedProductsBySellerId(currUserId);
      const fetchedBoughtProducts = await getBoughtProductsByBuyerId(currUserId);

      setListedProducts(fetchedListedProducts);
      setBoughtProducts(fetchedBoughtProducts);
      setItems(fetchedListedProducts);
    })();
  }, [showSaleSuccess]);

  const toggle = () => {
    setShowListed(!showListed);
    if (showListed) setItems(boughtProducts);
    else setItems(listedProducts);
  };

  const TransactionHeader = () => (
    <thead>
      <tr>
        <th className='text-center' />
        <th>PRODUCT</th>
        <th>COLOR</th>
        <th>Size</th>
        <th>Status</th>
        <th>PRICE</th>
        <th>QTY</th>
        <th>AMOUNT</th>
      </tr>
    </thead>
  );

  type ContactCustomerButtonProps = {
    customer: Customer;
    title: string;
  };

  const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
    const [showContact, setShowContact] = useState(false);

    const { customer, title } = props;

    const handleShow = () => setShowContact(true);
    const handleClose = () => setShowContact(false);

    return (
      <React.Fragment>
        <ContactButton onClick={handleShow}>{title}</ContactButton>
        <Dialog open={showContact} onClose={handleClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <p>Email: {customer.email}</p>
            <p>Username: {customer.username}</p>
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={handleClose}>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  };

  const TransactionRow = (props: {
    sneaker: Sneaker;
    handleCompleteSale: (listedProdId: number) => void;
  }) => {
    const { id, name, colorway, imageUrls, size, price, quantity, prodStatus, buyer, seller } = props.sneaker;

    const SellerCTAButtonsGroup = () => {
      switch (prodStatus) {
        case 'pending':
          return (
            <div className='flex margin-right-except-last'>
              <ContactCustomerButton customer={buyer!} title='Contact Buyer' />
              <CompleteSaleButton onClick={() => props.handleCompleteSale(id!)}>
                Complete Sale
              </CompleteSaleButton>
            </div>
          );
        case 'sold':
          return (
            <div className='flex margin-right-except-last'>
              <ContactCustomerButton customer={buyer!} title='Contact Buyer' />
              <LeaveReview title='Rate Buyer' listedProductId={id!} rateUser={rateBuyer} />
            </div>
          );
        default:
          return null;
      }
    };

    const BuyerCTAButtonsGroup = () => {
      switch (prodStatus) {
        case 'pending':
          return (
            <div className='flex margin-right-except-last'>
              <ContactCustomerButton customer={seller!} title='Contact Seller' />
            </div>
          );
        case 'sold':
          return (
            <div className='flex margin-right-except-last'>
              <ContactCustomerButton customer={seller!} title='Contact Seller' />
              <LeaveReview title='Rate Buyer' listedProductId={id!} rateUser={rateSeller} />
            </div>
          );
        default:
          return null;
      }
    };

    const displayImg = imageUrls.split(',')[0];

    const upperCaseFirstLetter = (s: string | undefined) => {
      if (!s) return s;

      const firstLetter = s[0];
      return firstLetter.toUpperCase() + s.slice(1);
    };

    return (
      <tr>
        <td>
          <div className='img-container'>
            <img src={displayImg} alt={name + colorway} />
          </div>
        </td>
        <td>
          <span>{name}</span>
          <br />
          <small>by Balmain</small>
        </td>
        <td>{colorway}</td>
        <td>{size}</td>
        <td>{upperCaseFirstLetter(prodStatus)}</td>
        <td>
          <small>$</small>
          {price}
        </td>
        <td>{quantity || 1}</td>
        <td>
          <small>$</small>
          {(quantity || 1) * Number(price)}
        </td>
        <td style={{ minWidth: showListed ? '300px' : '200px' }}>
          {showListed ? <SellerCTAButtonsGroup /> : <BuyerCTAButtonsGroup />}
        </td>
      </tr>
    );
  };

  const computeTotalAmount = (sneakers: Sneaker[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  const handleCompleteSale = async (listedProdId: number) => {
    await updateProdStatus(listedProdId, 'sold');
    setShowCompleteSaleSuccess(true);
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CardTitle tag='h4'>{showListed ? 'Listed Products' : 'Bought Products'}</CardTitle>
          <div>
            Listed
            <Switch checked={!showListed} onChange={toggle} color='default' />
            Bought
          </div>
        </CardHeader>
        <CardBody>
          {items && items.length > 0 ? (
            <Table responsive className='table-shopping'>
              <TransactionHeader />
              <tbody>
                {items.map((sneaker, idx) => (
                  <TransactionRow key={idx} sneaker={sneaker} handleCompleteSale={handleCompleteSale} />
                ))}
                <tr>
                  <td colSpan={7} />
                  <td className='td-total'>Total</td>
                  <td className='td-price'>
                    <small>$</small>
                    {computeTotalAmount(items)}
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div>Nothing so far :(</div>
          )}
        </CardBody>
      </Card>
      <Dialog open={showSaleSuccess} onClose={() => setShowCompleteSaleSuccess(false)}>
        <DialogTitle>Congratulations! You have closed the deal!</DialogTitle>
      </Dialog>
    </React.Fragment>
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
