import React from 'react';
import { Table } from 'reactstrap';

import moment from 'moment';

import styled from 'styled-components';

import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { upperCaseFirstLetter } from 'utils/utils';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import CenterSpinner from 'components/CenterSpinner';

const ListedSneakerTableHeader = () => (
  <thead>
    <tr>
      <th>name</th>
      <th>sold date</th>
      <th>status</th>
      <th>price</th>
      <th>qty</th>
      <th>amount</th>
    </tr>
  </thead>
);

type ListedSneakerTableRowProps = {
  sneaker: SellerListedSneaker;
};

type ListedSneakerTableProps = {
  isFetchingData: boolean;
  sneakers: SellerListedSneaker[];
  setShowCompleteSaleSuccess?: () => void;
};

const ImgContainer = styled.div`
  float: left;

  @media (min-width: 150px) {
    width: 60px;
  }

  @media (min-width: 768px) {
    width: 80px;
  }
`;

const ListedSneakerTable = (props: ListedSneakerTableProps) => {
  const { sneakers, isFetchingData, setShowCompleteSaleSuccess } = props;

  const computeTotalAmount = (sneakers: (SellerListedSneaker | BuyerPurchasedSneaker)[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  const ListedSneakerRow = (props: ListedSneakerTableRowProps) => {
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
      buyer,
      sizeSystem,
    } = props.sneaker;

    const displayImg = imageUrls.split(',')[0];

    const onCompleteSale = async () => {
      await ListedSneakerControllerInstance.updateListedSneakerStatus(id, { prodStatus: 'sold' });
      if (setShowCompleteSaleSuccess) setShowCompleteSaleSuccess();
    };

    const displayName = `${brand} ${name} ${colorway}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

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
        <td>{buyer ? moment(buyer.transactionDatetime).format('YYYY-MM-DD') : 'N/A'}</td>
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

  return isFetchingData ? (
    <CenterSpinner />
  ) : sneakers && sneakers.length > 0 ? (
    <Table responsive className='table-shopping'>
      <ListedSneakerTableHeader />
      <tbody>
        {sneakers.map((s, idx) => (
          <ListedSneakerRow key={idx} sneaker={s} />
        ))}
        <tr>
          <td colSpan={5} />
          <td className='td-total'>Total</td>
          <td className='td-price'>
            <small>$</small>
            {computeTotalAmount(sneakers)}
          </td>
        </tr>
      </tbody>
    </Table>
  ) : (
    <div>No listed sneakers</div>
  );
};

export default ListedSneakerTable;
