import React, { useState } from 'react';

import { RemoveButton } from './StyledButton';

import { useTransactionTableContext } from 'providers/TransactionTableProvider';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';

type RemoveListingProps = {
  listedProdId: number;
  title: string;
};

const RemoveListing = (props: RemoveListingProps) => {
  const { removeUnsoldSneakers } = useTransactionTableContext()
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { title, listedProdId } = props;

  const handleShow = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);
  const handleRemoveListing = async () => {
    setIsLoading(true)
    await ListedSneakerControllerInstance.removeListing(listedProdId)
    removeUnsoldSneakers(listedProdId)
    setShowDialog(false)
    setIsLoading(false)
  }

  return (
    <React.Fragment>
      <RemoveButton color='primary' onClick={handleShow}>{title}</RemoveButton>
      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove this listing?</p>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleRemoveListing} disabled={isLoading}>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default RemoveListing;
