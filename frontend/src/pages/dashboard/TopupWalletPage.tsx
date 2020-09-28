import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import { Paper } from '@material-ui/core';
import TopupWalletDialog from 'components/TopupWalletDialog';

import { useWalletCtx } from 'providers/WalletCtxProvider';

const TopupWalletPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { walletBalance } = useWalletCtx();

  return (
    <div>
      <PanelHeader size='sm' />
      <Paper style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '300px' }}>
          <Card>
            <CardHeader>
              <CardTitle>
                <h5 style={{ margin: 0 }}>Balance</h5>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <h3 style={{ margin: 0 }}>{`$${walletBalance}`}</h3>
            </CardBody>
          </Card>
          <Button onClick={handleOpen} style={{ width: '100%', fontSize: '1.25em' }} color='primary'>
            Topup
          </Button>
        </div>
      </Paper>
      <TopupWalletDialog isOpen={open} handleClose={handleClose} />
    </div>
  );
};

export default TopupWalletPage;