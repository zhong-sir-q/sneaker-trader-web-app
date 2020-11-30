import React, { useState } from 'react';

import { RemoveButton } from './StyledButton';

import { useTransactionTableContext } from 'providers/TransactionTableProvider';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Button } from 'reactstrap';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

type RemoveListingButtonProps = {
  listedProdId: number;
  title: string;
  onConfirmRemove: () => void;
};

const RemoveListingButton = (props: RemoveListingButtonProps) => {
  const { removeUnsoldSneakers } = useTransactionTableContext();
  const openDialogHook = useOpenCloseComp();
  const [isLoading, setIsLoading] = useState(false);

  const { title, listedProdId, onConfirmRemove } = props;

  const handleRemoveListing = () => {
    setIsLoading(true);
    onConfirmRemove();
    removeUnsoldSneakers(listedProdId);
    openDialogHook.onClose();
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <RemoveButton color='primary' onClick={openDialogHook.onOpen}>
        {title}
      </RemoveButton>
      <Dialog open={openDialogHook.open} onClose={openDialogHook.onClose}>
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

export default RemoveListingButton;
