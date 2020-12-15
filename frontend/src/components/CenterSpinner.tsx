import React from 'react';
import { Row, Spinner } from 'reactstrap';

const CenterSpinner = (props: { fullScreenHeight?: boolean; fullParentHeight?: boolean }) => (
  <Row
    style={{
      minHeight: props.fullScreenHeight ? 'calc(99vh - 96px)' : props.fullParentHeight ? '100%' : undefined,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spinner style={{ width: '3rem', height: '3rem' }} />
  </Row>
);

export default CenterSpinner;
