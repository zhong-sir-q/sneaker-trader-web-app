import React from 'react';
import clsx from 'clsx';

import {
  Table,
  Card,
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
  Label,
  Row,
  Col,
  FormGroup,
} from 'reactstrap';
import { Dialog, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';
import { Formik, Form as FormikForm } from 'formik';
import styled from 'styled-components';

import PanelHeader from 'components/PanelHeader';
import SneakerNameCell from 'components/SneakerNameCell';
import SneakerSearchBar from 'components/SneakerSearchBar';

import useSortableColData from 'hooks/useSortableColData';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

import { SneakerCondition } from '../../../shared';
import FormikLabelSelect from 'components/formik/FormikLabelSelect';
import FormikLabelInput from 'components/formik/FormikLabelInput';
import moment from 'moment';
import { range } from 'utils/utils';

type PortfolioSneaker = {
  brand: string;
  name: string;
  size: number;
  colorway: string;
  mainDisplayImage: string;
  condition: SneakerCondition;
  purchaseDate: string;
  purchasePrice: number;
  // the marketValue is not part of the moel, instaed, it
  // will be computed in real time when data is retrieved
  marketValue: number;
};

type PortfolioTabaleRowProps = {
  sneaker: PortfolioSneaker;
};

const mockPortfolioSneakers: PortfolioSneaker[] = [
  {
    mainDisplayImage:
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
    mainDisplayImage:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
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
    mainDisplayImage:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
    name: 'Kobe 14',
    brand: 'Nike',
    colorway: 'Black',
    size: 10,
    purchaseDate: '19/09/2020',
    condition: 'dead stock',
    purchasePrice: 600,
    marketValue: 550,
  },
  {
    mainDisplayImage:
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
    mainDisplayImage:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
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
    mainDisplayImage:
      'https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083',
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
    const {
      brand,
      name,
      size,
      colorway,
      mainDisplayImage,
      condition,
      purchaseDate,
      purchasePrice,
      marketValue,
    } = props.sneaker;

    const diffAmount = (n1: number, n2: number) => n1 - n2;

    // the percentage of difference of n1 from n2
    const diffPercentage = (n1: number, n2: number) => Math.round((diffAmount(n1, n2) / n1) * 100);

    return (
      <tr>
        <SneakerNameCell
          name={`${brand} ${name}`}
          colorway={colorway}
          displaySize={`US Men's Size: ${size}`}
          imgSrc={mainDisplayImage}
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
    <Table responsive className='table-shopping'>
      <PortfolioTableHeader />
      <tbody>
        {sortedItems.map((sneaker, idx) => (
          <PortfolioTableRow sneaker={sneaker} key={idx} />
        ))}
      </tbody>
    </Table>
  );
};

// NOTE: these are the smae styled components from SneakerSearchBar

const ListItemImg = styled.img`
  width: 100px;
  margin-right: 10px;

  @media (min-width: 768px) {
    width: 125px;
    margin-right: 20px;
  }
`;

const StyledListGroupItem = styled(ListGroupItem)`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const StyledListGroupItemText = styled(ListGroupItemText)`
  line-height: 18px;

  @media (max-width: 688px) {
    font-size: 0.9em;
  }
`;

const XButton = styled.div`
  position: absolute;
  right: 8px;
  top: 0;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
`;

type SearchResultItemProps = {
  onClose: () => void;
  imgSrc: string;
  itemText: string;
};

const SearchResultItem = () => (
  <ListGroup>
    <StyledListGroupItem>
      <XButton>x</XButton>
      <ListItemImg src='https://sneaker-trader-client-images-uploads.s3.amazonaws.com/sneakers/5a8c4e7f8895057e0348529a31bee083' />
      <StyledListGroupItemText>Nike Kobe 14 Black</StyledListGroupItemText>
    </StyledListGroupItem>
  </ListGroup>
);

type PortfolioFormValues = {
  size: number;
  prodCondition: SneakerCondition;
  purchaseMonth: string;
  purchaseYear: string;
  purchasePrice: number;
};

const INIT_PORTFOLIO_FORM_VALUES: PortfolioFormValues = {
  size: ('' as unknown) as number,
  prodCondition: 'dead stock',
  purchaseMonth: '',
  purchaseYear: '',
  purchasePrice: ('' as unknown) as number,
};

type PortfolioFormProps = {
  onSubmit: () => void
}

const PortfolioForm = () => {
  return (
    <Formik
      initialValues={INIT_PORTFOLIO_FORM_VALUES}
      onSubmit={() => {
        console.log('Form is submitted');
      }}
    >
      <FormikForm>
        <FormGroup>
          <SearchResultItem />
        </FormGroup>
        <FormGroup>
          {/* TODO: the sizes need to be retrieved from th database, here is only a mock */}
          <FormikLabelSelect name='size' label='Size' id='portfolio-sneaker-size'>
            {range(3, 16, 1).map((size) => (
              <option value={size} key={size}>
                {size}
              </option>
            ))}
          </FormikLabelSelect>
        </FormGroup>

        <FormGroup>
          <FormikLabelSelect name='prodCondition' label='Condition' id='portfolio-sneaker-condition'>
            <option value='dead stock'>Dead Stock</option>
            <option value='new'>New</option>
            <option value='used'>Used</option>
          </FormikLabelSelect>
        </FormGroup>

        <Label>Purchase Date</Label>

        <Row>
          <Col>
            <FormGroup>
              <FormikLabelSelect name='purchaseMonth' label='' id='portfolio-sneaker-purchase-month'>
                <option value=''>Month</option>
                {moment.months().map((m) => (
                  <option value='m' key={m}>
                    {m}
                  </option>
                ))}
              </FormikLabelSelect>
            </FormGroup>
          </Col>

          <Col>
            <FormGroup>
              <FormikLabelSelect name='purchaseYear' label='' id='portfolio-sneaker-purchase-year'>
                <option value=''>Year</option>
                {range(new Date().getFullYear(), 1985, -1).map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </FormikLabelSelect>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <FormikLabelInput
            style={{ width: '135px' }}
            name='originalPurchasePrice'
            placeholder='$$ ~ $$$$$'
            type='number'
            label='Purchase Price'
          />
        </FormGroup>
        <Button color='primary'>Submit</Button>
      </FormikForm>
    </Formik>
  );
};

const DialogHeader = styled.div`
  background-color: #2e2e2e;
  color: #ffffff;
`;

// set overflowY to visible to show the search suggestions
const useStyles = makeStyles({
  paperFullWidth: {
    overflowY: 'visible',
  },
  scrollPaper: {
    alignItems: 'start',
  },
  dialogContentRoot: {
    overflowY: 'visible',
  },
});

const Portfolio = () => {
  const { open, onOpen, onClose } = useOpenCloseComp();

  const classes = useStyles();

  return (
    <React.Fragment>
      <PanelHeader size='lg' />
      <Container fluid='md'>
        <div className='text-right'>
          <Button onClick={onOpen} color='primary'>
            Add Item
          </Button>
        </div>
        <Card>
          <PortfolioTable sneakers={mockPortfolioSneakers} />
        </Card>
        <Dialog
          classes={{
            paperFullWidth: classes.paperFullWidth,
            scrollPaper: classes.scrollPaper,
          }}
          fullWidth
          maxWidth='sm'
          open={open}
          onClose={onClose}
        >
          <DialogHeader>
            <DialogTitle>Add Item To Porfolio</DialogTitle>
          </DialogHeader>
          <DialogContent
            classes={{
              root: classes.dialogContentRoot,
            }}
          >
            {/* <SneakerSearchBar items={mockPortfolioSneakers} /> */}
            <PortfolioForm />
          </DialogContent>
        </Dialog>
      </Container>
    </React.Fragment>
  );
};

export default Portfolio;
