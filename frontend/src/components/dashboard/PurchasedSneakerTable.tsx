import React, { useState } from 'react';
import clsx from 'clsx';

import { Table } from 'reactstrap';
import { List, ListItem, makeStyles } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

import moment from 'moment';

import BuyerCTAButtonsGroup from 'components/buttons/BuyerCTAButtonsGroup';

import useSortableColData from 'hooks/useSortableColData';
import usePagination from 'hooks/usePagination';
import useWindowDimensions from 'hooks/useWindowDimensions';

import { Header, DropdownRow, Cell, ShowDropdownHeader, ShowDropdownCell } from './table/Common';

import SneakerNameCell from 'components/SneakerNameCell';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import { upperCaseFirstLetter } from 'utils/utils';
import SneakerStatusText from './SneakerStatusText';

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
  console.log('sneakers', sneakers)

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
      userId,
      sizeSystem,
      prodCondition,
      transactionDatetime,
      productId
    } = props.sneaker;

    const displayName = `${brand} ${name} ${colorway}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

    const muiStyles = useMuiStyles();

    return (
      <React.Fragment>
        <tr>
          <SneakerNameCell imgSrc={mainDisplayImage} name={displayName} displaySize={displaySize} colorway={colorway} />
          <Cell>{moment(transactionDatetime).format('YYYY-MM-DD')}</Cell>
          <Cell className={muiStyles.uppercase}>
            <SneakerStatusText status={prodStatus} />
          </Cell>
          <Cell>
            <small>$</small>
            {price}
          </Cell>
          <Cell>{quantity || 1}</Cell>
          <Cell style={{ minWidth: '220px' }}>
            <BuyerCTAButtonsGroup listedProdId={id} prodStatus={prodStatus} seller={seller} userId={userId} productId={productId} />
          </Cell>
          <ShowDropdownCell onClick={() => onClickShowDropdown(rowIdx)}>
            {showRowDropdown ? <KeyboardArrowUp fontSize='default' /> : <KeyboardArrowDown fontSize='default' />}
          </ShowDropdownCell>
        </tr>
        {showRowDropdown && (
          <DropdownRow>
            <td colSpan={999}>
              <List>
                <ListItem>Purchased Date:&nbsp;{moment(transactionDatetime).format('YYYY-MM-DD')}</ListItem>
                <ListItem
                  classes={{
                    root: muiStyles.uppercase,
                  }}
                >
                  Condition:&nbsp;{upperCaseFirstLetter(prodCondition)}
                </ListItem>
                <ListItem>Price:&nbsp;${price}</ListItem>
                <ListItem>
                  <span>Status:&nbsp;</span> <SneakerStatusText status={prodStatus} />
                </ListItem>
                <ListItem>Quantity:&nbsp;{quantity || 1}</ListItem>
                <ListItem>
                  <BuyerCTAButtonsGroup listedProdId={id} prodStatus={prodStatus} seller={seller} userId={userId} productId={productId} />
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

const useMuiStyles = makeStyles(() => ({
  uppercase: {
    textTransform: 'capitalize',
  },
}));

export default PurchasedSneakerTable;
