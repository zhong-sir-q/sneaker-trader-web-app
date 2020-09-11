import React from 'react';
import { Row, Spinner } from 'reactstrap';

const CenterSpinner = () => (
  <Row
    style={{
      minHeight: 'calc(95vh - 96px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spinner style={{ width: '3rem', height: '3rem' }} />
  </Row>
);

export default CenterSpinner;
