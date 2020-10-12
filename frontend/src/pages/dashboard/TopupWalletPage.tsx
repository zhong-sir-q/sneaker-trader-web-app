import React from 'react';
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';

import { Paper } from '@material-ui/core';

import PanelHeader from 'components/PanelHeader';
import CenterSpinner from 'components/CenterSpinner';
import TopupWalletDialog from 'components/TopupWalletDialog';

import styled from 'styled-components';

import { useWalletCtx } from 'providers/WalletCtxProvider';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

const PaperContainer = styled(Paper)`
  display: flex;
  justify-content: center;
  padding: 20px;
  margin: 10%;
`;

const TopupWalletPage = () => {
  const { open, onOpen, onClose } = useOpenCloseComp()

  const { walletBalance } = useWalletCtx();

  return walletBalance === null ? (
    <CenterSpinner />
  ) : (
    <div>
      <PanelHeader size='sm' />
      <PaperContainer>
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
          <Button onClick={onOpen} style={{ width: '100%', fontSize: '1.25em' }} color='primary'>
            Topup
          </Button>
        </div>
      </PaperContainer>
      <TopupWalletDialog isOpen={open} handleClose={onClose} />
    </div>
  );
};

export default TopupWalletPage;
