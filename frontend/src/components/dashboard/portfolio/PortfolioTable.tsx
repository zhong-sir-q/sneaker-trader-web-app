import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Table } from 'reactstrap';

import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import { List, ListItem } from '@material-ui/core';

import SneakerNameCell from 'components/SneakerNameCell';

import { SneakerCondition } from '../../../../../shared';

import useSortableColData from 'hooks/useSortableColData';
import { Header, ShowDropdownHeader, Cell, ShowDropdownCell, DropdownRow } from '../table/Common';

import { mapUpperCaseFirstLetter } from 'utils/utils';

// NOTE: the only different field between this type
// and PortfolioSneakerWithMarketValue is purchaseDate
type TablePortfolioSneaker = {
  id: number;
  brand: string;
  name: string;
  size: number;
  colorway: string;
  mainDisplayImage: string;
  sneakerCondition: SneakerCondition;
  purchaseDate: string;
  purchasePrice: number;
  marketValue: number | null;
  gain: number | null;
  gainPercentage: number | null;
};

type PortfolioTabaleRowProps = {
  sneaker: TablePortfolioSneaker;
  rowIdx: number;
  showRowDropdown: boolean;
  onClickShowDropdown: (rowIdx: number) => void;
};

type PortfolioTableProps = {
  sneakers: TablePortfolioSneaker[];
  onDeleteRow: (portfolioSneakerId: number) => void;
};

const PortfolioTable = (props: PortfolioTableProps) => {
  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<TablePortfolioSneaker>(props.sneakers);

  const { onDeleteRow } = props;

  const [selectedDropdownIdx, setSelectedDropdownIdx] = useState<number>();

  const updateSelectedDropdownIDx = (idx: number) => {
    if (idx === selectedDropdownIdx) {
      // toggle the current dropdown
      setSelectedDropdownIdx(undefined);
      return;
    }

    setSelectedDropdownIdx(idx);
  };

  const headers = [
    { name: 'sneakerCondition', minWidth: '105px', text: 'condition' },
    { name: 'purchaseDate', minWidth: '105px', text: 'purchase date' },
    { name: 'purchasePrice', minWidth: '105px', text: 'purchase price' },
    { name: 'marketValue', minWidth: '105px', text: 'market value' },
    { name: 'gainPercentage', minWidth: '80px', text: 'gain/loss' },
  ];

  const PortfolioTableHeader = () => (
    <thead>
      <tr>
        <th className={clsx(getHeaderClassName('name'), 'pointer')} onClick={() => requestSort('name')}>
          name
        </th>
        {headers.map((h, idx) => (
          <Header
            minWidth={h.minWidth}
            onClick={() => requestSort(h.name)}
            className={clsx('sortable', 'pointer', getHeaderClassName(h.name))}
            key={idx}
          >
            {h.text}
          </Header>
        ))}
        <ShowDropdownHeader />
      </tr>
    </thead>
  );

  const PortfolioTableRow = (props: PortfolioTabaleRowProps) => {
    const { rowIdx, showRowDropdown, onClickShowDropdown } = props;

    const {
      id,
      brand,
      name,
      size,
      colorway,
      mainDisplayImage,
      sneakerCondition,
      purchaseDate,
      purchasePrice,
      marketValue,
      gain,
      gainPercentage,
    } = props.sneaker;

    return (
      <React.Fragment>
        <tr>
          <SneakerNameCell
            name={`${brand} ${name}`}
            colorway={colorway}
            displaySize={`US Men's Size: ${size}`}
            imgSrc={mainDisplayImage}
          />
          <Cell>{sneakerCondition}</Cell>
          <Cell>{purchaseDate}</Cell>
          <Cell>${purchasePrice}</Cell>
          <Cell>{!marketValue ? 'Unknown' : '$' + marketValue}</Cell>
          <Cell
            style={{
              color: gain === null ? '' : gain > 0 ? 'green' : 'red',
            }}
          >
            {gain === null ? 'Unknown' : `$${gain} (${gainPercentage}%)`}
          </Cell>
          <Cell>
            <Button onClick={() => onDeleteRow(id)} color='danger'>
              REMOVE
            </Button>
          </Cell>

          <ShowDropdownCell onClick={() => onClickShowDropdown(rowIdx)}>
            {showRowDropdown ? <KeyboardArrowUp fontSize='default' /> : <KeyboardArrowDown fontSize='default' />}
          </ShowDropdownCell>
        </tr>
        {showRowDropdown && (
          <DropdownRow>
            <List>
              <ListItem>Condition: {mapUpperCaseFirstLetter(sneakerCondition, ' ')}</ListItem>
              <ListItem>Purchase Date: {purchaseDate}</ListItem>
              <ListItem>Purhcase Price: ${purchasePrice}</ListItem>
              <ListItem>Market Value: {!marketValue ? 'Unknown' : '$' + marketValue}</ListItem>
              <ListItem>
                Gain/Loss:
                <span
                  style={{
                    color: gain === null ? '' : gain > 0 ? 'green' : 'red',
                  }}
                >
                  {gain === null ? ' Unknown' : ` $${gain} (${gainPercentage}%)`}
                </span>
              </ListItem>
              <ListItem>
                <Button onClick={() => onDeleteRow(id)} color='danger'>
                  REMOVE
                </Button>
              </ListItem>
            </List>
          </DropdownRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Table responsive className='table-shopping'>
      <PortfolioTableHeader />
      <tbody>
        {sortedItems.map((sneaker, idx) => (
          <PortfolioTableRow
            sneaker={sneaker}
            rowIdx={idx}
            showRowDropdown={selectedDropdownIdx === idx}
            onClickShowDropdown={updateSelectedDropdownIDx}
            key={idx}
          />
        ))}
      </tbody>
    </Table>
  );

  // NOTE: these are the smae styled components from SneakerSearchBar
};

export default PortfolioTable;
