import React from "react";
import clsx from "clsx";
import { Button, Table } from "reactstrap";

import SneakerNameCell from "components/SneakerNameCell";

import { SneakerCondition } from "../../../../../shared";

import useSortableColData from "hooks/useSortableColData";

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
};

type PortfolioTableProps = {
  sneakers: TablePortfolioSneaker[];
  onDeleteRow: (portfolioSneakerId: number) => void;
};

const PortfolioTable = (props: PortfolioTableProps) => {
  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<TablePortfolioSneaker>(props.sneakers);

  const { onDeleteRow } = props;

  const PortfolioTableHeader = () => (
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
          className={clsx('sortable', getHeaderClassName('sneakerCondition'))}
          onClick={() => requestSort('sneakerCondition')}
        >
          condition
        </th>
        <th
          style={{ minWidth: '80px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('purchaseDate'))}
          onClick={() => requestSort('purchaseDate')}
        >
          purchase date
        </th>
        <th
          style={{ minWidth: '75px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('purchasePrice'))}
          onClick={() => requestSort('purchasePrice')}
        >
          purchase price
        </th>
        <th
          style={{ minWidth: '60px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('marketValue'))}
          onClick={() => requestSort('marketValue')}
        >
          Market Value
        </th>

        <th
          style={{ minWidth: '60px', cursor: 'pointer' }}
          className={clsx('sortable', getHeaderClassName('gainPercentage'))}
          onClick={() => requestSort('gainPercentage')}
        >
          Gain/Loss
        </th>
        {/* empty column for row deleting */}
        <th></th>
      </tr>
    </thead>
  );

  const PortfolioTableRow = (props: PortfolioTabaleRowProps) => {
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
      <tr>
        <SneakerNameCell
          name={`${brand} ${name}`}
          colorway={colorway}
          displaySize={`US Men's Size: ${size}`}
          imgSrc={mainDisplayImage}
        />
        <td>{sneakerCondition}</td>
        <td>{purchaseDate}</td>
        <td>${purchasePrice}</td>
        <td>{!marketValue ? 'Unknown' : '$' + marketValue}</td>
        <td
          style={{
            color: gain === null ? '' : gain > 0 ? 'green' : 'red',
          }}
        >
          {gain === null ? 'Unknown' : `$${gain} (${gainPercentage}%)`}
        </td>
        <td>
          <Button onClick={() => onDeleteRow(id)} color='danger'>
            REMOVE
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Table responsive className='table-shopping'>
      <PortfolioTableHeader />
      <tbody>
        {sortedItems.map((sneaker, idx) => (
          <PortfolioTableRow sneaker={sneaker} key={idx} />
        ))}
      </tbody>
    </Table>
  );

  // NOTE: these are the smae styled components from SneakerSearchBar
};

export default PortfolioTable
