import React, {  } from 'react';

import { Table } from 'reactstrap';

import BuyerCTAButtonsGroup from 'components/buttons/BuyerCTAButtonsGroup';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import { upperCaseFirstLetter } from 'utils/utils';

const PurchasedSneakerTableHeader = () => (
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

type PurchasedSneakerRowProps = {
  sneaker: BuyerPurchasedSneaker;
};

type PurchasedSneakerTableProps = {
  sneakers: BuyerPurchasedSneaker[];
};

const PurchasedSneakerTable = (props: PurchasedSneakerTableProps) => {
  const { sneakers } = props;

  const computeTotalAmount = (sneakers: (SellerListedSneaker | BuyerPurchasedSneaker)[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  const PurchasedSneakerRow = (props: PurchasedSneakerRowProps) => {
    const { id, name, colorway, imageUrls, size, price, quantity, prodStatus, seller } = props.sneaker;

    const displayImg = imageUrls.split(',')[0];

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
        <td style={{ minWidth: '220px' }}>
          <BuyerCTAButtonsGroup listedProdId={id} prodStatus={prodStatus} seller={seller} />
        </td>
      </tr>
    );
  };

  return sneakers && sneakers.length > 0 ? (
    <Table responsive className='table-shopping'>
      <PurchasedSneakerTableHeader />
      <tbody>
        {sneakers.map((s, idx) => (
          <PurchasedSneakerRow key={idx} sneaker={s} />
        ))}
        <tr>
          <td colSpan={7} />
          <td className='td-total'>Total</td>
          <td className='td-price'>
            <small>$</small>
            {computeTotalAmount(sneakers)}
          </td>
        </tr>
      </tbody>
    </Table>
  ) : (
    <div>Nothing so far :(</div>
  );
};

export default PurchasedSneakerTable;
