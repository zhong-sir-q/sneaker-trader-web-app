import React, { useState, useEffect } from 'react';

import { Card, Container, Button } from 'reactstrap';

import { Dialog, DialogTitle, DialogContent, makeStyles, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import styled from 'styled-components';

// util libraries
import moment from 'moment';

import PanelHeader from 'components/PanelHeader';
import CenterSpinner from 'components/CenterSpinner';
import SneakerSearchBar from 'components/SneakerSearchBar';

import PortfolioTable from 'components/dashboard/portfolio/PortfolioTable';
import SearchResultItem from 'components/dashboard/portfolio/SearchResultItem';
import PortfolioForm, { PortfolioFormValues } from 'components/dashboard/portfolio/PortfolioForm';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

import { useAuth } from 'providers/AuthProvider';

import PortfolioControllerInstance from 'api/controllers/PortfolioController';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { PortfolioSneaker, SearchBarSneaker, PortfolioSneakerWithMarketValue, GetListedSneaker } from '../../../shared';

import { months, MonthKey } from 'data/date';
import onSubmitPortfolioForm from 'usecases/portfolio/onSubmitPortfolioForm';
import onRemovePortfolioTableRow from 'usecases/portfolio/onRemovePortfolioTableRow';

const formatTablePortfolioSneaker = (sneaker: PortfolioSneakerWithMarketValue) => ({
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

  const [fetchPortfolioSneakers, setFetchPortfolioSneakers] = useState(true);
  const [portfolioSneakers, setPortfolioSneakers] = useState<PortfolioSneakerWithMarketValue[]>();
  const [searchBarSneakers, setSearchBarSneakers] = useState<SearchBarSneaker[]>();

  const endFetchingPortfolioSneaker = () => setFetchPortfolioSneakers(false);
  const goFetchPortfolioSneaker = () => setFetchPortfolioSneakers(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetch = async () => {
      const portSneakers = await PortfolioControllerInstance.getAllWithMarketValueByUserId(currentUser.id);
      const listedSneakers = await ListedSneakerControllerInstance.getAllListedSneakers();

      setPortfolioSneakers(portSneakers);
      setSearchBarSneakers(listedSneakers.map(formatSearchBarSneaker));
    };

    if (fetchPortfolioSneakers) {
      fetch();
      endFetchingPortfolioSneaker();
    }
  }, [currentUser, fetchPortfolioSneakers]);

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

  const afterSubmitPortfolioForm = () => {
    goFetchPortfolioSneaker();
    onClose();

    // clean up
    resetStep();
    resetSelectedSneaker();
  };

  // add the data to the view and the database
  const onSubmitForm = async (formValues: PortfolioFormValues) => {
    if (!currentUser || !selectedSneaker) return;

    const portfolioSneakerPayload = formatPortfolioSneakerPayload(formValues, currentUser.id, selectedSneaker);
    onSubmitPortfolioForm(PortfolioControllerInstance)(portfolioSneakerPayload, afterSubmitPortfolioForm);
  };

  const removePortfolioTableRow = (portfolioSneakerId: number) => {
    onRemovePortfolioTableRow(PortfolioControllerInstance)(portfolioSneakerId, goFetchPortfolioSneaker);
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

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <Container fluid='md'>
        <div className='text-right'>
          <Button onClick={onOpen} color='primary'>
            Add Item
          </Button>
        </div>
        {!portfolioSneakers || fetchPortfolioSneakers ? (
          <CenterSpinner />
        ) : (
          <Card>
            <PortfolioTable
              sneakers={portfolioSneakers.map(formatTablePortfolioSneaker)}
              onDeleteRow={removePortfolioTableRow}
            />
          </Card>
        )}
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
