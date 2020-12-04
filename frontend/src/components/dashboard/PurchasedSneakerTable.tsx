import React, { useState } from 'react';
import clsx from 'clsx';

import { Table } from 'reactstrap';

import moment from 'moment';

import useSortableColData from 'hooks/useSortableColData';

import BuyerCTAButtonsGroup from 'components/buttons/BuyerCTAButtonsGroup';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import { upperCaseFirstLetter, mapUpperCaseFirstLetter } from 'utils/utils';
import usePagination from 'hooks/usePagination';

import { Header, DropdownRow, Cell, ShowDropdownHeader, ShowDropdownCell } from './table/Common';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { List, ListItem } from '@material-ui/core';
import SneakerNameCell from 'components/SneakerNameCell';
import { KeyboardArrowDown } from '@material-ui/icons';

const computeTotalAmount = (sneakers: (SellerListedSneaker | BuyerPurchasedSneaker)[]) => {
  let total = 0;

  for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

  return total;
};

type PurchasedSneakerRowProps = {
  sneaker: BuyerPurchasedSneaker;
  rowIdx: number;
  showRowDropdown: boolean;
  onClickShowDropdown: (rowIdx: number) => void;
};

type PurchasedSneakerTableProps = {
  sneakers: BuyerPurchasedSneaker[];
};

const PurchasedSneakerTable = (props: PurchasedSneakerTableProps) => {
  const { sneakers } = props;

  const [selectedDropdownIdx, setSelectedDropdownIdx] = useState<number>();

  const windowDimensions = useWindowDimensions();

  const updateSelectedDropdownIDx = (idx: number) => {
    if (idx === selectedDropdownIdx) {
      // toggle the current dropdown
      setSelectedDropdownIdx(undefined);
      return;
    }

    setSelectedDropdownIdx(idx);
  };

  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<BuyerPurchasedSneaker>(sneakers);

  const { currentPage, pagesCount, startRowCount, endRowCount, PaginationComponent } = usePagination(
    sneakers.length,
    5
  );

  const headerClass = (colName: string) => clsx('sortable', getHeaderClassName(colName), 'pointer');

  const PurchasedSneakerTableHeader = () => (
    <thead>
      <tr>
        <th className={headerClass('name')} onClick={() => requestSort('name')}>
          name
        </th>
        <Header
          minWidth='105px'
          className={headerClass('transactionDatetime')}
          onClick={() => requestSort('transactionDatetime')}
        >
          purchased date
        </Header>
        <Header minWidth='80px' className={headerClass('prodStatus')} onClick={() => requestSort('prodStatus')}>
          status
        </Header>
        <Header minWidth='75px' className={headerClass('price')} onClick={() => requestSort('price')}>
          price
        </Header>
        <Header minWidth='60px' className={headerClass('quantity')} onClick={() => requestSort('quantity')}>
          qty
        </Header>
        <ShowDropdownHeader />
      </tr>
    </thead>
  );

  const PurchasedSneakerRow = (props: PurchasedSneakerRowProps) => {
    const { rowIdx, showRowDropdown, onClickShowDropdown } = props;

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
      prodCondition,
      transactionDatetime,
    } = props.sneaker;

    const displayName = `${brand} ${name} ${colorway}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

    return (
      <React.Fragment>
        <tr>
          <SneakerNameCell imgSrc={mainDisplayImage} name={displayName} displaySize={displaySize} colorway={colorway} />
          <Cell>{moment(transactionDatetime).format('YYYY-MM-DD')}</Cell>
          <Cell>{upperCaseFirstLetter(prodStatus)}</Cell>
          <Cell>
            <small>$</small>
            {price}
          </Cell>
          <Cell>{quantity || 1}</Cell>
          <Cell style={{ minWidth: '220px' }}>
            <BuyerCTAButtonsGroup listedProdId={id} prodStatus={prodStatus} seller={seller} />
          </Cell>
          <ShowDropdownCell onClick={() => onClickShowDropdown(rowIdx)}>
            <KeyboardArrowDown fontSize='default' />
          </ShowDropdownCell>
        </tr>
        {showRowDropdown && (
          <DropdownRow>
            <td colSpan={999}>
              <List>
                <ListItem>Purchased Date: {moment(transactionDatetime).format('YYYY-MM-DD')}</ListItem>
                <ListItem>Status: {upperCaseFirstLetter(prodStatus)}</ListItem>
                <ListItem>Price: ${price}</ListItem>
                <ListItem>Condition: {mapUpperCaseFirstLetter(prodCondition, ' ')}</ListItem>
                <ListItem>Quantity: {quantity || 1}</ListItem>
                <ListItem>
                  <BuyerCTAButtonsGroup listedProdId={id} prodStatus={prodStatus} seller={seller} />
                </ListItem>
              </List>
            </td>
          </DropdownRow>
        )}
      </React.Fragment>
    );
  };

  return sortedItems && sortedItems.length > 0 ? (
    <React.Fragment>
      <Table responsive className='table-shopping'>
        <PurchasedSneakerTableHeader />
        <tbody>
          {sortedItems.slice(startRowCount(), endRowCount()).map((s, idx) => (
            <PurchasedSneakerRow
              sneaker={s}
              showRowDropdown={idx === selectedDropdownIdx}
              onClickShowDropdown={updateSelectedDropdownIDx}
              rowIdx={idx}
              key={idx}
            />
          ))}
          <tr>
            {windowDimensions.width > 1024 && <td colSpan={4} />}
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
