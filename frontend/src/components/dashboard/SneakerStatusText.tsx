import React from 'react';
import { SneakerStatus } from '../../../../shared';
import styled from 'styled-components';

type SneakerStatusTextProps = {
  status: SneakerStatus;
};

const StyledText = styled.span<SneakerStatusTextProps>`
  color: ${({ status }) =>
    status === 'pending'
      ? '#f96332'
      : status === 'new sneaker request'
      ? 'cornflowerblue'
      : status === 'listed'
      ? 'purple'
      : // green represents when the sneaker is sold, no color for
        // deleted status because it will not show up in the user's ui
        'green'};
`;

const SneakerStatusText = (props: SneakerStatusTextProps) => (
  <StyledText status={props.status}>{props.status}</StyledText>
);

export default SneakerStatusText;
