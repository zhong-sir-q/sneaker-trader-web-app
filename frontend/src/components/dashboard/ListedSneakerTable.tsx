import React, {  } from 'react';
import { Table } from 'reactstrap';

import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';

import ListedSneakerControllerInstance from 'api/ListedSneakerController';

import { upperCaseFirstLetter } from 'utils/utils';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';

const ListedSneakerTableHeader = () => (
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

type ListedSneakerTableRowProps = {
  sneaker: SellerListedSneaker;
};

type ListedSneakerTableProps = {
  sneakers: SellerListedSneaker[];
  setShowCompleteSaleSuccess?: () => void;
};

const ListedSneakerTable = (props: ListedSneakerTableProps) => {
  const { sneakers, setShowCompleteSaleSuccess } = props;

  const computeTotalAmount = (sneakers: (SellerListedSneaker | BuyerPurchasedSneaker)[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  const ListedSneakerRow = (props: ListedSneakerTableRowProps) => {
    const { id, name, colorway, imageUrls, size, price, quantity, prodStatus, buyer } = props.sneaker;

    const displayImg = imageUrls.split(',')[0];

    const onCompleteSale = async () => {
      await ListedSneakerControllerInstance.updateListedSneakerStatus(id, { prodStatus: 'sold' });
      if (setShowCompleteSaleSuccess) setShowCompleteSaleSuccess();
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
        <td style={{ minWidth: '220px' }}>
          <SellerCTAButtonsGroup
            listedProdId={id}
            buyer={buyer}
            prodStatus={prodStatus}
            onCompleteSale={onCompleteSale}
          />
        </td>
      </tr>
    );
  };

  return sneakers && sneakers.length > 0 ? (
    <Table responsive className='table-shopping'>
      <ListedSneakerTableHeader />
      <tbody>
        {sneakers.map((s, idx) => (
          <ListedSneakerRow key={idx} sneaker={s} />
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

export default ListedSneakerTable;
