import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Table } from 'reactstrap';
import { List, ListItem, makeStyles } from '@material-ui/core';
import { Edit, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

import clsx from 'clsx';
import moment from 'moment';

import SneakerNameCell from 'components/SneakerNameCell';
import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { createEditListedSneakerPath } from 'utils/utils';

import useWindowDimensions from 'hooks/useWindowDimensions';
import useSortableColData from 'hooks/useSortableColData';
import usePagination from 'hooks/usePagination';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';

import { Header, ShowDropdownHeader, Cell, ShowDropdownCell, DropdownRow } from './table/Common';
import SneakerStatusText from './SneakerStatusText';

type ListedSneakerTableRowProps = {
  sneaker: SellerListedSneaker;
  rowIdx: number;
  showRowDropdown: boolean;
  onClickShowDropdown: (rowIdx: number) => void;
};

type ListedSneakerTableProps = {
  sneakers: SellerListedSneaker[];
  setShowCompleteSaleSuccess?: () => void;
};

const ListedSneakerTable = (props: ListedSneakerTableProps) => {
  const { sneakers, setShowCompleteSaleSuccess } = props;

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

  const history = useHistory();

  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<SellerListedSneaker>(sneakers);

  const { currentPage, pagesCount, startRowCount, endRowCount, PaginationComponent } = usePagination(
    sneakers.length,
    5
  );

  const headerClass = (colName: string) => clsx('sortable', getHeaderClassName(colName), 'pointer');

  const ListedSneakerTableHeader = () => (
    <thead>
      <tr>
        <th className={headerClass('name')} onClick={() => requestSort('name')}>
          name
        </th>
        <Header
          minWidth='115px'
          className={headerClass('listedDatetime')}
          onClick={() => requestSort('listedDatetime')}
        >
          listed date
        </Header>
        <Header
          minWidth='105px'
          className={headerClass('buyer.transactionDatetime')}
          onClick={() => requestSort('buyer.transactionDatetime')}
        >
          sold date
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

  const computeTotalAmount = (sneakers: (SellerListedSneaker | BuyerPurchasedSneaker)[]) => {
    let total = 0;

    for (const s of sneakers) total += (s.quantity || 1) * Number(s.price);

    return total;
  };

  const ListedSneakerRow = (props: ListedSneakerTableRowProps) => {
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
      buyer,
      sizeSystem,
      userId,
      listedDatetime,
      prodCondition,
      productId
    } = props.sneaker;

    const onCompleteSale = async () => {
      await ListedSneakerControllerInstance.updateListedSneakerStatus(id, { prodStatus: 'sold' });
      if (setShowCompleteSaleSuccess) setShowCompleteSaleSuccess();
    };

    const onRemoveListing = () => ListedSneakerControllerInstance.removeListing(id);

    const onEdit = () => {
      const editPath = createEditListedSneakerPath(props.sneaker.id);
      history.push(editPath, props.sneaker);
    };

    const displayName = `${brand} ${name}`;
    const displaySize = `${sizeSystem} Men's Size: ${size}`;

    const muiStyles = useMuiStyles();

    return (
      <React.Fragment>
        <tr>
          <SneakerNameCell imgSrc={mainDisplayImage} name={displayName} displaySize={displaySize} colorway={colorway} />
          <Cell>{moment(listedDatetime).format('YYYY-MM-DD')}</Cell>
          <Cell>{buyer ? moment(buyer.transactionDatetime).format('YYYY-MM-DD') : 'N/A'}</Cell>
          <Cell className={muiStyles.uppercase}>
            <SneakerStatusText status={prodStatus} />
          </Cell>
          <Cell>
            <small>$</small>
            {price}
          </Cell>
          <Cell>{quantity || 1}</Cell>
          <Cell>{prodStatus === 'listed' && <Edit className='pointer' onClick={onEdit} />}</Cell>
          <Cell style={{ minWidth: '220px' }}>
            <SellerCTAButtonsGroup
              listedProdId={id}
              productId={productId}
              userId={userId}
              buyer={buyer}
              prodStatus={prodStatus}
              onCompleteSale={onCompleteSale}
              onRemoveListing={onRemoveListing}
            />
          </Cell>
          <ShowDropdownCell onClick={() => onClickShowDropdown(rowIdx)}>
            {showRowDropdown ? <KeyboardArrowUp fontSize='default' /> : <KeyboardArrowDown fontSize='default' />}
          </ShowDropdownCell>
        </tr>
        {/* use a large colspan to take up the whole row */}
        {showRowDropdown && (
          <DropdownRow>
            <td colSpan={999}>
              <List>
                <ListItem>Listed Date: {moment(listedDatetime).format('YYYY-MM-DD')}</ListItem>
                <ListItem>Sold Date: {buyer ? moment(buyer.transactionDatetime).format('YYYY-MM-DD') : 'N/A'}</ListItem>
                <ListItem classes={{ root: muiStyles.uppercase }}>Condition:&nbsp;{prodCondition}</ListItem>
                <ListItem>Price: ${price}</ListItem>
                <ListItem classes={{ root: muiStyles.uppercase }}>
                  Status:&nbsp;
                  <SneakerStatusText status={prodStatus} />
                </ListItem>
                <ListItem>Quantity: {quantity || 1}</ListItem>
                <ListItem>
                  <SellerCTAButtonsGroup
                    listedProdId={id}
                    productId={productId}
                    userId={userId}
                    buyer={buyer}
                    prodStatus={prodStatus}
                    onCompleteSale={onCompleteSale}
                    onRemoveListing={onRemoveListing}
                  />
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
        <ListedSneakerTableHeader />
        <tbody>
          {sortedItems.slice(startRowCount(), endRowCount()).map((s, idx) => (
            <ListedSneakerRow
              sneaker={s}
              showRowDropdown={idx === selectedDropdownIdx}
              onClickShowDropdown={updateSelectedDropdownIDx}
              rowIdx={idx}
              key={idx}
            />
          ))}
          <tr>
            {windowDimensions.width > 1124 && <td colSpan={6} />}
            <td className='td-total'>Total</td>
            <td className='td-price' style={{ fontSize: '1.25em' }}>
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

const useMuiStyles = makeStyles(() => ({
  uppercase: {
    textTransform: 'capitalize',
  },
}));

export default ListedSneakerTable;
