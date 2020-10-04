import React from 'react';
import { Table } from 'reactstrap';

import clsx from 'clsx';
import moment from 'moment';

import styled from 'styled-components';

import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { upperCaseFirstLetter } from 'utils/utils';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import CenterSpinner from 'components/CenterSpinner';
import useSortableColData from 'hooks/useSortableColData';
import usePagination from 'hooks/usePagination';

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

  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<SellerListedSneaker>(sneakers);

  const { currentPage, pagesCount, startRecordCount, endRecordCount, PaginationComponent } = usePagination(sneakers.length, 5);

  const ListedSneakerTableHeader = () => (
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
          className={clsx('sortable', getHeaderClassName('buyer.transactionDatetime'))}
          onClick={() => requestSort('buyer.transactionDatetime')}
        >
          sold date
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
  ) : sortedItems && sortedItems.length > 0 ? (
    <React.Fragment>
      <Table responsive className='table-shopping'>
        <ListedSneakerTableHeader />
        <tbody>
          {sortedItems.slice(startRecordCount(), endRecordCount()).map((s, idx) => (
            <ListedSneakerRow key={idx} sneaker={s} />
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
          <span style={{ alignSelf: 'center' }}>{currentPage + 1} of {pagesCount}</span>
      </div>
    </React.Fragment>
  ) : (
    <div>No listed sneakers</div>
  );
};

export default ListedSneakerTable;
