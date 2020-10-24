import React from 'react';
import { Table } from 'reactstrap';

import clsx from 'clsx';
import moment from 'moment';

import SneakerNameCell from 'components/SneakerNameCell';
import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { upperCaseFirstLetter } from 'utils/utils';

import useSortableColData from 'hooks/useSortableColData';
import usePagination from 'hooks/usePagination';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';

type ListedSneakerTableRowProps = {
  sneaker: SellerListedSneaker;
};

type ListedSneakerTableProps = {
  sneakers: SellerListedSneaker[];
  setShowCompleteSaleSuccess?: () => void;
};

const ListedSneakerTable = (props: ListedSneakerTableProps) => {
  const { sneakers, setShowCompleteSaleSuccess } = props;

  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<SellerListedSneaker>(sneakers);

  const { currentPage, pagesCount, startRowCount, endRowCount, PaginationComponent } = usePagination(
    sneakers.length,
    5
  );

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
      mainDisplayImage,
      size,
      price,
      quantity,
      prodStatus,
      buyer,
      sizeSystem,
    } = props.sneaker;

    const onCompleteSale = async () => {
      await ListedSneakerControllerInstance.updateListedSneakerStatus(id, { prodStatus: 'sold' });
      if (setShowCompleteSaleSuccess) setShowCompleteSaleSuccess();
    };

    const displayName = `${brand} ${name}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

    return (
      <tr>
        <SneakerNameCell imgSrc={mainDisplayImage} name={displayName} displaySize={displaySize} colorway={colorway} />
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

  return sortedItems && sortedItems.length > 0 ? (
    <React.Fragment>
      <Table responsive className='table-shopping'>
        <ListedSneakerTableHeader />
        <tbody>
          {sortedItems.slice(startRowCount(), endRowCount()).map((s, idx) => (
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
        <span style={{ alignSelf: 'center' }}>
          {currentPage + 1} of {pagesCount}
        </span>
      </div>
    </React.Fragment>
  ) : (
    <div>No listed sneakers</div>
  );
};

export default ListedSneakerTable;
