import React, { useState, useEffect } from 'react';

import { Dialog, DialogTitle, Switch } from '@material-ui/core';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';

import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';
import BuyerCTAButtonsGroup from 'components/buttons/BuyerCTAButtonsGroup';

import { getListedProductsBySellerId, getBoughtProductsByBuyerId, updateProdStatus } from 'api/api';
import { getCurrentUser } from 'utils/auth';

import { Sneaker } from '../../../../shared';

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

type TransactionRowProps = {
  sneaker: Sneaker;
  showListedProducts: boolean;
  showCompleteSaleSuccess: () => void;
};

const TransactionRow = (props: TransactionRowProps) => {
  const { id, name, colorway, imageUrls, size, price, quantity, prodStatus, buyer, seller } = props.sneaker;

  const { showListedProducts, showCompleteSaleSuccess } = props;

  const displayImg = imageUrls.split(',')[0];

  const upperCaseFirstLetter = (s: string | undefined) => {
    if (!s) return s;

    const firstLetter = s[0];
    return firstLetter.toUpperCase() + s.slice(1);
  };

  const onCompleteSale = async () => {
    await updateProdStatus(id!, 'sold');
    showCompleteSaleSuccess();
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
      <td style={{ minWidth: showListedProducts ? '300px' : '200px' }}>
        {showListedProducts ? (
          <SellerCTAButtonsGroup
            listedProdId={id!}
            prodStatus={prodStatus!}
            onCompleteSale={onCompleteSale}
            buyer={buyer!}
          />
        ) : (
          <BuyerCTAButtonsGroup listedProdId={id!} prodStatus={prodStatus!} seller={seller!} />
        )}
      </td>
    </tr>
  );
};

const TransactionHistory = () => {
  const [items, setItems] = useState<Sneaker[]>();
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

  const toggleShowListed = () => {
    setShowListed(!showListed);
    if (showListed) setItems(boughtProducts);
    else setItems(listedProducts);
  };

  const computeTotalAmount = (sneakers: Sneaker[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CardTitle tag='h4'>{showListed ? 'Listed Products' : 'Bought Products'}</CardTitle>
          <div>
            Listed
            <Switch checked={!showListed} onChange={toggleShowListed} color='default' />
            Bought
          </div>
        </CardHeader>
        <CardBody>
          {items && items.length > 0 ? (
            <Table responsive className='table-shopping'>
              <TransactionHeader />
              <tbody>
                {items.map((sneaker, idx) => (
                  <TransactionRow
                    key={idx}
                    sneaker={sneaker}
                    showCompleteSaleSuccess={() => setShowCompleteSaleSuccess(true)}
                    showListedProducts={showListed}
                  />
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

export default TransactionHistory;
