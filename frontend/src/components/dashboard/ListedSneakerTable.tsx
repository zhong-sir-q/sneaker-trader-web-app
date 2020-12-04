import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';

import clsx from 'clsx';
import moment from 'moment';

import SneakerNameCell from 'components/SneakerNameCell';
import SellerCTAButtonsGroup from 'components/buttons/SellerCTAButtonsGroup';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { upperCaseFirstLetter, createEditListedSneakerPath, mapUpperCaseFirstLetter } from 'utils/utils';

import useSortableColData from 'hooks/useSortableColData';
import usePagination from 'hooks/usePagination';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../../shared';
import { useHistory } from 'react-router-dom';
import { Edit, KeyboardArrowDown } from '@material-ui/icons';
import styled from 'styled-components';
import { List, ListItem } from '@material-ui/core';

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

const StyledListedSneakerRowCell = styled.td`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ShowDropdownSneakerHeader = styled.th`
  @media (min-width: 1024px) {
    display: none;
  }
`;

const DropdownRow = styled.tr`
  font-weight: 600;
  font-size: 1.25em;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const ShowDropdownSneakerRowCell = styled.td`
  vertical-align: middle;
  text-align: center;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const StyledListedSneakerHeader = styled.th<{ minWidth: string }>`
  min-width: ${({ minWidth }) => minWidth};

  @media (max-width: 1024px) {
    display: none;
    width: 0;
  }
`;

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;

  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

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
        <StyledListedSneakerHeader
          minWidth='115px'
          className={headerClass('listedDatetime')}
          onClick={() => requestSort('listedDatetime')}
        >
          listed date
        </StyledListedSneakerHeader>
        <StyledListedSneakerHeader
          minWidth='105px'
          className={headerClass('buyer.transactionDatetime')}
          onClick={() => requestSort('buyer.transactionDatetime')}
        >
          sold date
        </StyledListedSneakerHeader>
        <StyledListedSneakerHeader
          minWidth='80px'
          className={headerClass('prodStatus')}
          onClick={() => requestSort('prodStatus')}
        >
          status
        </StyledListedSneakerHeader>
        <StyledListedSneakerHeader
          minWidth='75px'
          className={headerClass('price')}
          onClick={() => requestSort('price')}
        >
          price
        </StyledListedSneakerHeader>
        <StyledListedSneakerHeader
          minWidth='60px'
          className={headerClass('quantity')}
          onClick={() => requestSort('quantity')}
        >
          qty
        </StyledListedSneakerHeader>
        <ShowDropdownSneakerHeader />
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
      listedDatetime,
      prodCondition,
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

    return (
      <React.Fragment>
        <tr>
          <SneakerNameCell imgSrc={mainDisplayImage} name={displayName} displaySize={displaySize} colorway={colorway} />
          <StyledListedSneakerRowCell>{moment(listedDatetime).format('YYYY-MM-DD')}</StyledListedSneakerRowCell>
          <StyledListedSneakerRowCell>
            {buyer ? moment(buyer.transactionDatetime).format('YYYY-MM-DD') : 'N/A'}
          </StyledListedSneakerRowCell>
          <StyledListedSneakerRowCell>{upperCaseFirstLetter(prodStatus)}</StyledListedSneakerRowCell>
          <StyledListedSneakerRowCell>
            <small>$</small>
            {price}
          </StyledListedSneakerRowCell>
          <StyledListedSneakerRowCell>{quantity || 1}</StyledListedSneakerRowCell>
          <StyledListedSneakerRowCell>
            {prodStatus === 'listed' && <Edit className='pointer' onClick={onEdit} />}
          </StyledListedSneakerRowCell>
          <StyledListedSneakerRowCell style={{ minWidth: '220px' }}>
            <SellerCTAButtonsGroup
              listedProdId={id}
              buyer={buyer}
              prodStatus={prodStatus}
              onCompleteSale={onCompleteSale}
              onRemoveListing={onRemoveListing}
            />
          </StyledListedSneakerRowCell>
          <ShowDropdownSneakerRowCell onClick={() => onClickShowDropdown(rowIdx)}>
            <KeyboardArrowDown fontSize='large' />
          </ShowDropdownSneakerRowCell>
        </tr>
        {/* use a large colspan to take up the whole row */}
        {showRowDropdown && (
          <DropdownRow>
            <td colSpan={999}>
              <List>
                <ListItem>Listed Date: {moment(listedDatetime).format('YYYY-MM-DD')}</ListItem>
                <ListItem>Sold Date: {buyer ? moment(buyer.transactionDatetime).format('YYYY-MM-DD') : 'N/A'}</ListItem>
                <ListItem>Status: {prodStatus}</ListItem>
                <ListItem>Price: ${price}</ListItem>
                <ListItem>Condition: {mapUpperCaseFirstLetter(prodCondition, ' ')}</ListItem>
                <ListItem>Quantity: {quantity || 1}</ListItem>
                <ListItem>
                  <SellerCTAButtonsGroup
                    listedProdId={id}
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
            {windowDimensions.width > 1024 && <td colSpan={6} />}
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
