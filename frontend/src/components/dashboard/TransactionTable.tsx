import React from "react";

import { Table } from 'reactstrap'

import SellerCTAButtonsGroup from "components/buttons/SellerCTAButtonsGroup";
import BuyerCTAButtonsGroup from "components/buttons/BuyerCTAButtonsGroup";

import { updateProdStatus } from "api/api";
import { Sneaker } from "../../../../shared";

const upperCaseFirstLetter = (s: string | undefined) => {
  if (!s) return s;

  const firstLetter = s[0];
  return firstLetter.toUpperCase() + s.slice(1);
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

type TransactionRowProps = {
  sneaker: Sneaker;
};

type TransactionTableProps = {
  showListed: boolean;
  sneakers: Sneaker[] | undefined;
  setShowCompleteSaleSuccess?: () => void;
};

const TransactionTable = (props: TransactionTableProps) => {
  const { showListed, sneakers, setShowCompleteSaleSuccess } = props;

  const computeTotalAmount = (sneakers: Sneaker[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  const TransactionRow = (props: TransactionRowProps) => {
    const { id, name, colorway, imageUrls, size, price, quantity, prodStatus, buyer, seller } = props.sneaker;

    const displayImg = imageUrls.split(',')[0];

    const onCompleteSale = async () => {
      await updateProdStatus(id!, 'sold');
      setShowCompleteSaleSuccess!();
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
          {showListed ? (
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

  return sneakers && sneakers.length > 0 ? (
    <Table responsive className='table-shopping'>
      <TransactionHeader />
      <tbody>
        {sneakers.map((s, idx) => (
          <TransactionRow key={idx} sneaker={s} />
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

export default TransactionTable
