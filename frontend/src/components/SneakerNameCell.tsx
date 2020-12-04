import React from 'react';

import styled from 'styled-components';
import { Tooltip } from '@material-ui/core';

const ImgContainer = styled.div`
  float: left;
`;

const Img = styled.img`
  object-fit: cover;

  @media (min-width: 768px) {
    width: 90px;
    height: 70px;
  }

  @media (min-width: 150px) {
    width: 70px;
    height: 50px;
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
    <td>
      <ImgContainer>
        <Img src={imgSrc} alt={name + colorway} />
      </ImgContainer>

      <SneakerNameTextWrapper>
        <Tooltip title={`${name} ${colorway}`}>
          <div>
            <SneakerNameCellText>{name}</SneakerNameCellText>
            <SneakerNameCellText>{colorway}</SneakerNameCellText>
          </div>
        </Tooltip>
        <SizeText className='category'>{displaySize}</SizeText>
      </SneakerNameTextWrapper>
    </td>
  );
};

export default SneakerNameCell;
