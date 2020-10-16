import React from 'react';
import { Table, Card, Container, Button } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SneakerNameCell from 'components/SneakerNameCell';
import { SneakerCondition } from '../../../shared';
import useSortableColData from 'hooks/useSortableColData';
import clsx from 'clsx';

type PortfolioSneaker = {
  brand: string;
  name: string;
  size: number;
  colorway: string;
  imgUrl: string;
  condition: SneakerCondition;
  purchaseDate: string;
  purchasePrice: number;
  marketValue: number;
};

type PortfolioTabaleRowProps = {
  sneaker: PortfolioSneaker;
};

const mockPortfolioSneakers: PortfolioSneaker[] = [
  {
    imgUrl:
      'https://sneaker-trader-client-images-uploads.s3.ap-southeast-2.amazonaws.com/sneakers/7a8d285961ee67bb3dc38bafda5bf6cc',
    name: 'KD 13',
    brand: 'Nike',
    colorway: 'The Easy Money Snipers',
    size: 9.5,
    purchaseDate: '19/08/2020',
    condition: 'dead stock',
    purchasePrice: 400,
    marketValue: 550,
  },
  {
    imgUrl: 'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
    name: 'Kobe 14',
    brand: 'Nike',
    colorway: 'Black',
    size: 12,
    purchaseDate: '19/07/2020',
    condition: 'new',
    purchasePrice: 900,
    marketValue: 550,
  },
  {
    imgUrl: 'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
    name: 'Kobe 14',
    brand: 'Nike',
    colorway: 'Black',
    size: 10,
    purchaseDate: '19/09/2020',
    condition: 'dead stock',
    purchasePrice: 600,
    marketValue: 550,
  },
];

type PortfolioTableProps = {
  sneakers: PortfolioSneaker[];
};

const PortfolioTable = (props: PortfolioTableProps) => {
  const { sortedItems, requestSort, getHeaderClassName } = useSortableColData<PortfolioSneaker>(props.sneakers);

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
          className={clsx('sortable', getHeaderClassName('condition'))}
          onClick={() => requestSort('condition')}
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

        <th>Gain/Loss</th>
      </tr>
    </thead>
  );

  const PortfolioTableRow = (props: PortfolioTabaleRowProps) => {
    const { brand, name, size, colorway, imgUrl, condition, purchaseDate, purchasePrice, marketValue } = props.sneaker;

    const diffAmount = (n1: number, n2: number) => n1 - n2;

    // the percentage of difference of n1 from n2
    const diffPercentage = (n1: number, n2: number) => Math.round((diffAmount(n1, n2) / n1) * 100);

    return (
      <tr>
        <SneakerNameCell
          name={`${brand} ${name}`}
          colorway={colorway}
          displaySize={`US Men's Size: ${size}`}
          imgSrc={imgUrl}
        />
        <td>{condition}</td>
        <td>{purchaseDate}</td>
        <td>${purchasePrice}</td>
        <td>${marketValue}</td>
        <td>
          {diffAmount(marketValue, purchasePrice)} ({diffPercentage(marketValue, purchasePrice)}%)
        </td>
      </tr>
    );
  };

  return (
    <Table responsive>
      <PortfolioTableHeader />
      <tbody>
        {sortedItems.map((sneaker, idx) => (
          <PortfolioTableRow sneaker={sneaker} key={idx} />
        ))}
      </tbody>
    </Table>
  );
};

const Portfolio = () => {
  return (
    <React.Fragment>
      <PanelHeader size='lg' />
      <Container fluid='md'>
        <div className='text-right'>
          <Button color='primary'>Add Item</Button>
        </div>
        <Card>
          <PortfolioTable sneakers={mockPortfolioSneakers} />
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default Portfolio;
