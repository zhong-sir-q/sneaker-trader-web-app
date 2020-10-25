import React from 'react';

import { Button } from 'reactstrap';
import { Drawer } from '@material-ui/core';

import styled from 'styled-components';

import ButtonFilters from './FilterButtons';
import CheckboxFilters from './CheckboxFilters';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import MuiCloseButton from 'components/buttons/MuiCloseButton';

const CollapseButtonDiv = styled.div`
  text-align: end;
  display: block;

  @media (min-width: 786px) {
    display: none;
  }
`;

type FiltersDrawerProps = { sizeFilters: string[]; brandFilters: string[] };

const FiltersDrawer = (props: FiltersDrawerProps) => {
  const { sizeFilters, brandFilters } = props;

  const { open, onOpen, onClose } = useOpenCloseComp();

  return (
    <React.Fragment>
      <CollapseButtonDiv>
        <Button onClick={onOpen}>Filter</Button>
      </CollapseButtonDiv>
      <Drawer anchor='bottom' open={open} onClose={onClose}>
        <MuiCloseButton onClick={onClose} />
        <div style={{ padding: '50px' }}>
          <ButtonFilters filterKey='size' filters={sizeFilters} title='us sizes' />
          <CheckboxFilters filterKey='brand' filters={brandFilters} title='brands' />
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default FiltersDrawer;
