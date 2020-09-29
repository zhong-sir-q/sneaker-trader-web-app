import React from 'react';

import { Table } from 'reactstrap';

import BuyerCTAButtonsGroup from 'components/buttons/BuyerCTAButtonsGroup';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import { upperCaseFirstLetter } from 'utils/utils';
import styled from 'styled-components';

const PurchasedSneakerTableHeader = () => (
  <thead>
    <tr>
      <th>Name</th>
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
    const {
      id,
      brand,
      name,
      colorway,
      imageUrls,
      size,
      price,
      quantity,
      prodStatus,
      seller,
      sizeSystem,
    } = props.sneaker;

    const displayImg = imageUrls.split(',')[0];

    const displayName = `${brand} ${name} ${colorway}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

    const ImgContainer = styled.div`
      float: left;
      @media (min-width: 150px) {
        width: 60px;
      }

      @media (min-width: 768px) {
        width: 80px;
      }
    `;

    return (
      <tr>
        <td>
          <ImgContainer>
            <img src={displayImg} alt={name + colorway} />
          </ImgContainer>
          <div style={{ overflowX: 'hidden', paddingLeft: '8px', top: '5px' }}>
            <span style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflowX: 'hidden' }}>
              {displayName}
            </span>
            <span
              style={{
                color: '#000',
                fontSize: '0.85em',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflowX: 'hidden',
                display: 'block',
              }}
              className='category'
            >
              {displaySize}
            </span>
          </div>
        </td>
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
          <td colSpan={4} />
          <td className='td-total'>Total</td>
          <td className='td-price'>
            <small>$</small>
            {computeTotalAmount(sneakers)}
          </td>
        </tr>
      </tbody>
    </Table>
  ) : (
    <div>No purchased sneakers</div>
  );
};

export default PurchasedSneakerTable;
