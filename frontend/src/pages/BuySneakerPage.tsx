import React from 'react';
import SneakerCard from 'components/SneakerCard';
import SneakerCardProps from '__tests__/data/SneakerCardProps';
import { Container, Button } from 'reactstrap';
import styled from 'styled-components';

const MockSneakerCard = () => <SneakerCard sneaker={SneakerCardProps} maxWidth='400px' style={{ padding: '25px' }} />;

const FlexContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// use the path name to query the sneaker
const BuySneakerPage = () => {
  return (
    <FlexContainer>
      <MockSneakerCard />
      {/* TODO: implement the logic for checkout */}
      <Button color='primary' onClick={() => console.log('BUY ME!')}>
        Buy
      </Button>
    </FlexContainer>
  );
};

export default BuySneakerPage;
