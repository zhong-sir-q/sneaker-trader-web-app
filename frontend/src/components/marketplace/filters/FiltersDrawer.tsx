import useMuiCloseButtonStyle from 'hooks/useMuiCloseButtonStyle';
import { FiltersProps } from './filter';
import React from 'react';

import { Button } from 'reactstrap';
import { Close } from '@material-ui/icons';
import { Drawer, IconButton } from '@material-ui/core';

import styled from 'styled-components';

import ButtonFilters from './ButtonFilters';
import CheckboxFilters from './CheckboxFilters';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

const CollapseButtonDiv = styled.div`
  text-align: end;
  display: block;

  @media (min-width: 786px) {
    display: none;
  }
`;

type FiltersDrawerProps = { sizeFilters: string[]; brandFilters: string[] } & Pick<
  FiltersProps,
  'onSelectFilter' | 'filterSelected'
>;

const FiltersDrawer = (props: FiltersDrawerProps) => {
  const { sizeFilters, brandFilters, onSelectFilter, filterSelected } = props;

  const { open, onOpen, onClose } = useOpenCloseComp();

  const classes = useMuiCloseButtonStyle();

  return (
    <React.Fragment>
      <CollapseButtonDiv>
        <Button onClick={onOpen}>Filter</Button>
      </CollapseButtonDiv>
      <Drawer anchor='bottom' open={open} onClose={onClose}>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
        <div style={{ padding: '50px' }}>
          <ButtonFilters
            onSelectFilter={onSelectFilter}
            filterSelected={filterSelected}
            filterKey='size'
            filters={sizeFilters}
            title='us sizes'
          />
          <CheckboxFilters onSelectFilter={onSelectFilter} filterKey='brand' filters={brandFilters} title='brands' />
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default FiltersDrawer;
