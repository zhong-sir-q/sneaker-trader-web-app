import React from 'react';
import { Row, Spinner } from 'reactstrap';

const CenterSpinner = (props: { fullHeight?: boolean }) => (
  <Row
    style={{
      minHeight: props.fullHeight ? 'calc(99vh - 96px)' : undefined,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spinner style={{ width: '3rem', height: '3rem' }} />
  </Row>
);

export default CenterSpinner;
