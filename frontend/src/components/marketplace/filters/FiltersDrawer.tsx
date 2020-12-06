import React from 'react';

import { Button } from 'reactstrap';
import { Drawer } from '@material-ui/core';

import styled from 'styled-components';

import CheckboxFilters from './CheckboxFilters';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import MuiCloseButton from 'components/buttons/MuiCloseButton';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';
import FilterButtons from './FilterButtons';

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
  const { numFilters, clearFilters } = useMarketPlaceCtx();

  const onCloseNotApplied = () => {
    clearFilters();
    onClose();
  };

  return (
    <React.Fragment>
      <CollapseButtonDiv>
        <Button onClick={onOpen}>Filter</Button>
      </CollapseButtonDiv>
      {/* set variant to persistent, so the drawer does not unmount on open/close, so the
      filters do not get re-rendereed */}
      <Drawer variant='persistent' anchor='bottom' open={open} onClose={onCloseNotApplied}>
        <MuiCloseButton onClick={onCloseNotApplied} />
        <div style={{ padding: '50px', overflow: 'auto', paddingBottom: 0 }}>
          <FilterButtons filterKey='size' filters={sizeFilters} title='us sizes' />
          <CheckboxFilters filterKey='brand' filters={brandFilters} title='brands' />
        </div>
        {numFilters > 0 && (
          <div style={{ display: 'flex', padding: '0 50px' }}>
            <Button style={{ flex: 1 }} onClick={clearFilters}>
              Clear ({numFilters})
            </Button>
            {/* the state is updated when the filters are selected, this button simply closes the dialog */}
            <Button onClick={onClose} style={{ flex: 1, backgroundColor: 'black' }}>
              Apply
            </Button>
          </div>
        )}
      </Drawer>
    </React.Fragment>
  );
};

export default FiltersDrawer;
