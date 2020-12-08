import React from 'react';

import styled from 'styled-components';

const ImgContainer = styled.div`
  float: left;
`;

const Img = styled.img`
  object-fit: cover;

  @media (min-width: 768px) {
    width: 5.625rem;
    height: 4.375rem;
  }

  @media (min-width: 150px) {
    width: 4.375rem;
    height: 3.125rem;
  }
`;

type SneakerNameCellProps = {
  imgSrc: string;
  name: string;
  colorway: string;
  displaySize: string;
};

const SneakerNameTextWrapper = styled.div`
  overflow-x: hidden;
  padding-left: 8px;
  top: 5px;
`;

const SizeText = styled.div`
  color: #000;
  font-size: 0.85em;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const SneakerNameCellText = styled.div`
  font-weight: 600;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const SneakerNameCell = (props: SneakerNameCellProps) => {
  const { imgSrc, name, colorway, displaySize } = props;

  return (
    <TableCell>
      <ImgContainer>
        <Img src={imgSrc} alt={name + colorway} />
      </ImgContainer>

      <SneakerNameTextWrapper>
        <SneakerNameCellText>{name}</SneakerNameCellText>
        <SneakerNameCellText>{colorway}</SneakerNameCellText>
        <SizeText className='category'>{displaySize}</SizeText>
      </SneakerNameTextWrapper>
    </TableCell>
  );
};

const TableCell = styled.td`
`;

export default SneakerNameCell;
