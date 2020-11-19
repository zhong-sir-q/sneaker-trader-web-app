import React from 'react';

import styled from 'styled-components';

type AspectRatio = {
  aspectRatio: string;
};

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
`;

const StyledImageContainer = styled.div<AspectRatio>`
  position: relative;
  padding-bottom: ${({ aspectRatio }) => aspectRatio};
`;

type FixedAspectRatioProps = AspectRatio & { imgSrc: string | undefined };

const FixedAspectRatioImg = (props: FixedAspectRatioProps) => (
  <StyledImageContainer aspectRatio={props.aspectRatio}>
    <StyledImage src={props.imgSrc} />
  </StyledImageContainer>
);

export default FixedAspectRatioImg;
