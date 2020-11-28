import React from 'react';
import clsx from 'clsx';

import { Table } from 'reactstrap';
import styled from 'styled-components';

import moment from 'moment';

import useSortableColData from 'hooks/useSortableColData';

import BuyerCTAButtonsGroup from 'components/buttons/BuyerCTAButtonsGroup';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import { upperCaseFirstLetter } from 'utils/utils';
import usePagination from 'hooks/usePagination';

// this two components are the exact same ones from SneakerNameCell
const ImgContainer = styled.div`
  float: left;
`;

const Img = styled.img`
  object-fit: cover;

  @media (min-width: 768px) {
    width: 90px;
    height: 70px;
  }

  @media (min-width: 150px) {
    width: 70px;
    height: 50px;
  }
`;

const computeTotalAmount = (sneakers: (SellerListedSneaker | BuyerPurchasedSneaker)[]) => {
  let total = 0;

  for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

  return total;
};

type PurchasedSneakerRowProps = {
  sneaker: BuyerPurchasedSneaker;
};

type PurchasedSneakerTableProps = {
  sneakers: BuyerPurchasedSneaker[];
};

const PurchasedSneakerTable = (props: PurchasedSneakerTableProps) => {
  const { sneakers } = props;

  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<BuyerPurchasedSneaker>(sneakers);

  const { currentPage, pagesCount, startRowCount, endRowCount, PaginationComponent } = usePagination(
    sneakers.length,
    5
  );

  const PurchasedSneakerTableHeader = () => (
    <thead>
      <tr>
        <th
          style={{ cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('name'))}
          onClick={() => requestSort('name')}
        >
          name
        </th>
        <th
          style={{ minWidth: '105px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('transactionDatetime'))}
          onClick={() => requestSort('transactionDatetime')}
        >
          purchased date
        </th>
        <th
          style={{ minWidth: '80px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('prodStatus'))}
          onClick={() => requestSort('prodStatus')}
        >
          status
        </th>
        <th
          style={{ minWidth: '75px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('price'))}
          onClick={() => requestSort('price')}
        >
          price
        </th>
        <th
          style={{ minWidth: '60px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('quantity'))}
          onClick={() => requestSort('quantity')}
        >
          qty
        </th>
      </tr>
    </thead>
  );

  const PurchasedSneakerRow = (props: PurchasedSneakerRowProps) => {
    const {
      id,
      brand,
      name,
      colorway,
      mainDisplayImage,
      size,
      price,
      quantity,
      prodStatus,
      seller,
      sizeSystem,
      transactionDatetime,
    } = props.sneaker;

    const displayName = `${brand} ${name} ${colorway}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

    return (
      <tr>
        <td>
          <ImgContainer>
            <Img src={mainDisplayImage} alt={name + colorway} />
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
        <td>{moment(transactionDatetime).format('YYYY-MM-DD')}</td>
        <td>{upperCaseFirstLetter(prodStatus)}</td>
        <td>
          <small>$</small>
          {price}
        </td>
        <td>{quantity || 1}</td>
        <td style={{ minWidth: '220px' }}>
          <BuyerCTAButtonsGroup listedProdId={id} prodStatus={prodStatus} seller={seller} />
        </td>
      </tr>
    );
  };

  return sortedItems && sortedItems.length > 0 ? (
    <React.Fragment>
      <Table responsive className='table-shopping'>
        <PurchasedSneakerTableHeader />
        <tbody>
          {sortedItems.slice(startRowCount(), endRowCount()).map((s, idx) => (
            <PurchasedSneakerRow key={idx} sneaker={s} />
          ))}
          <tr>
            <td colSpan={5} />
            <td className='td-total'>Total</td>
            <td className='td-price'>
              <small>$</small>
              {computeTotalAmount(sortedItems)}
            </td>
          </tr>
        </tbody>
      </Table>
      <div className='flex justify-center'>
        <PaginationComponent />
        <span style={{ alignSelf: 'center' }}>
          {currentPage + 1} of {pagesCount}
        </span>
      </div>
    </React.Fragment>
  ) : (
    <div>No purchased sneakers</div>
  );
};

export default PurchasedSneakerTable;
