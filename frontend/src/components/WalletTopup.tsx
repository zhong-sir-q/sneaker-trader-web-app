import React from 'react';
import PanelHeader from './PanelHeader';
import { Input, Card } from 'reactstrap';

const WalletTopup = () => {
  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Card>
          <div>
          <Input />
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WalletTopup;
