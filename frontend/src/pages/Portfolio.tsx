import React, { useState, useEffect } from 'react';
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

import { Dialog, DialogTitle, DialogContent, makeStyles, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { Formik, Form as FormikForm } from 'formik';
import styled from 'styled-components';

// util libraries
import * as Yup from 'yup';
import moment from 'moment';

import PanelHeader from 'components/PanelHeader';
import SneakerNameCell from 'components/SneakerNameCell';
import SneakerSearchBar from 'components/SneakerSearchBar';

import useSortableColData from 'hooks/useSortableColData';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

import FormikLabelSelect from 'components/formik/FormikLabelSelect';
import FormikLabelInput from 'components/formik/FormikLabelInput';

import { range } from 'utils/utils';
import { useAuth } from 'providers/AuthProvider';
import PortfolioControllerInstance from 'api/controllers/PortfolioController';
import CenterSpinner from 'components/CenterSpinner';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import {
  SneakerCondition,
  PortfolioSneaker,
  SearchBarSneaker,
  PortfolioSneakerWithMarketValue,
  GetListedSneaker,
} from '../../../shared';
import { requiredPositiveNumber, required } from 'utils/yup';
import { months, MonthKey } from 'data/date';

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

        <th>Gain/Loss</th>
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
        <td>{sneakerCondition}</td>
        <td>{purchaseDate}</td>
        <td>${purchasePrice}</td>
        <td>{!marketValue ? 'Unknown' : '$' + marketValue}</td>
        <td
          style={{
            color: marketValue === null ? '' : diffAmount(marketValue, purchasePrice) > 0 ? 'green' : 'red',
          }}
        >
          {!marketValue
            ? 'Unknown'
            : `${diffAmount(marketValue, purchasePrice)} (${diffPercentage(marketValue, purchasePrice)}%)`}
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

const Cancel = styled.div`
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

const SearchResultItem = (props: SearchResultItemProps) => (
  <ListGroup>
    <StyledListGroupItem>
      <Cancel onClick={props.onClose}>x</Cancel>
      <ListItemImg src={props.imgSrc} />
      <StyledListGroupItemText>{props.itemText}</StyledListGroupItemText>
    </StyledListGroupItem>
  </ListGroup>
);

type PortfolioFormValues = {
  size: string;
  sneakerCondition: SneakerCondition;
  purchaseMonth: string;
  purchaseYear: string;
  purchasePrice: string;
};

const MIN_SNEAKER_SIZE = 3;

const INIT_PORTFOLIO_FORM_VALUES: PortfolioFormValues = {
  size: String(MIN_SNEAKER_SIZE),
  sneakerCondition: 'dead stock',
  purchaseMonth: '',
  purchaseYear: '',
  purchasePrice: '',
};

const portfolioFormValidations = Yup.object({
  purchaseMonth: required(),
  purchaseYear: required(),
  purchasePrice: requiredPositiveNumber('Purchase price'),
});

type PortfolioFormProps = {
  onSubmit: (values: PortfolioFormValues) => void;
  SearchResultChild: () => JSX.Element;
};

const PortfolioForm = (props: PortfolioFormProps) => {
  const { SearchResultChild } = props;

  return (
    <Formik
      initialValues={INIT_PORTFOLIO_FORM_VALUES}
      validationSchema={portfolioFormValidations}
      onSubmit={(formValues) => props.onSubmit(formValues)}
    >
      <FormikForm>
        <FormGroup style={{ padding: '20px' }}>
          <SearchResultChild />
        </FormGroup>
        <FormGroup>
          {/* TODO: the sizes need to be retrieved from th database, here is only a mock */}
          <FormikLabelSelect name='size' label='U.S Size' id='portfolio-sneaker-size'>
            {range(MIN_SNEAKER_SIZE, 16, 1).map((size) => (
              <option value={size} key={size}>
                {size}
              </option>
            ))}
          </FormikLabelSelect>
        </FormGroup>

        <FormGroup>
          <FormikLabelSelect name='sneakerCondition' label='Condition' id='portfolio-sneaker-condition'>
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
                {Object.keys(months).map((m) => (
                  <option value={m} key={m}>
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
            name='purchasePrice'
            placeholder='$$ ~ $$$$$'
            type='number'
            label='Purchase Price'
          />
        </FormGroup>
        <Button type='submit' color='primary'>
          Submit
        </Button>
      </FormikForm>
    </Formik>
  );
};

const formatTablePortfolioSneaker = (sneaker: PortfolioSneakerWithMarketValue): TablePortfolioSneaker => ({
  ...sneaker,
  purchaseDate: `${moment().endOf('month').format('DD')}/${sneaker.purchaseMonth}/${sneaker.purchaseYear}`,
});

const DialogHeader = styled.div`
  background-color: #2e2e2e;
  color: #ffffff;
`;

// set overflowY to visible to show the search suggestions
const useStyles = makeStyles((theme) => ({
  paperFullWidth: {
    overflowY: 'visible',
  },
  scrollPaper: {
    alignItems: 'start',
  },
  dialogContentRoot: {
    overflowY: 'visible',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    outline: 'none',
  },
}));

const formatSearchBarSneaker = (s: GetListedSneaker): SearchBarSneaker => {
  const { name, colorway, brand, mainDisplayImage } = s;

  return { name, colorway, brand, mainDisplayImage };
};

const Portfolio = () => {
  const { currentUser } = useAuth();

  const [goFetchPortfolioSneakers, setGoFetchPortfolioSneakers] = useState(true);
  const [portfolioSneakers, setPortfolioSneakers] = useState<PortfolioSneakerWithMarketValue[]>();
  const [searchBarSneakers, setSearchBarSneakers] = useState<SearchBarSneaker[]>();

  useEffect(() => {
    if (!currentUser) return;

    const fetch = async () => {
      const portSneakers = await PortfolioControllerInstance.getAllWithMarketValueByUserId(currentUser.id);
      const listedSneakers = await ListedSneakerControllerInstance.getAllListedSneakers();

      setPortfolioSneakers(portSneakers);
      setSearchBarSneakers(listedSneakers.map(formatSearchBarSneaker));
    };

    if (goFetchPortfolioSneakers) {
      fetch();
      setGoFetchPortfolioSneakers(false);
    }
  }, [currentUser, goFetchPortfolioSneakers]);

  const { open, onOpen, onClose } = useOpenCloseComp();

  const classes = useStyles();

  const [selectedSneaker, setSelectdSneaker] = useState<SearchBarSneaker>();

  const [step, setStep] = useState(0);
  const prevStep = () => setStep(step - 1);
  const nextStep = () => setStep(step + 1);

  // resets
  const resetStep = () => setStep(0);
  const resetSelectedSneaker = () => setSelectdSneaker(undefined);

  const onCancelChosenSneaker = () => {
    prevStep();
    resetSelectedSneaker();
  };

  const onConfirmSearchSneaker = (sneaker: SearchBarSneaker) => {
    setSelectdSneaker(sneaker);
    nextStep();
  };

  const formatPortfolioSneakerPayload = (
    values: PortfolioFormValues,
    userId: number,
    selectedSneaker: SearchBarSneaker
  ): Omit<PortfolioSneaker, 'id'> => ({
    ...values,
    ...selectedSneaker,
    userId,
    size: Number(values.size),
    purchasePrice: Number(values.purchasePrice),
    purchaseMonth: months[values.purchaseMonth as MonthKey],
    purchaseYear: Number(values.purchaseYear),
  });

  // add the data to the view and the database
  const onSubmitForm = async (formValues: PortfolioFormValues) => {
    if (!currentUser || !selectedSneaker) return;

    await PortfolioControllerInstance.add(formatPortfolioSneakerPayload(formValues, currentUser.id, selectedSneaker));

    setGoFetchPortfolioSneakers(true);
    onClose();

    // clean up
    resetStep();
    resetSelectedSneaker();
  };

  const renderComp = () => {
    switch (step) {
      case 0:
        return <SneakerSearchBar sneakers={searchBarSneakers || []} onChooseSneaker={onConfirmSearchSneaker} />;
      case 1:
        if (!selectedSneaker) return null;
        const { brand, name, colorway } = selectedSneaker;
        const resultItemText = `${brand} ${name} ${colorway}`;

        return (
          <PortfolioForm
            onSubmit={onSubmitForm}
            SearchResultChild={() => (
              <SearchResultItem
                onClose={onCancelChosenSneaker}
                imgSrc={selectedSneaker.mainDisplayImage}
                itemText={resultItemText}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  const removePortfolioTableRow = async (portfolioSneakerId: number) => {
    await PortfolioControllerInstance.delete(portfolioSneakerId);
    setGoFetchPortfolioSneakers(true);
  };

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <Container fluid='md'>
        <div className='text-right'>
          <Button onClick={onOpen} color='primary'>
            Add Item
          </Button>
        </div>
        <Card>
          {!portfolioSneakers || goFetchPortfolioSneakers ? (
            <CenterSpinner />
          ) : (
            <PortfolioTable
              sneakers={portfolioSneakers.map(formatTablePortfolioSneaker)}
              onDeleteRow={removePortfolioTableRow}
            />
          )}
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
            <DialogTitle>
              Add Item To Porfolio
              <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
          </DialogHeader>
          <DialogContent
            classes={{
              root: classes.dialogContentRoot,
            }}
          >
            {renderComp()}
          </DialogContent>
        </Dialog>
      </Container>
    </React.Fragment>
  );
};

export default Portfolio;
