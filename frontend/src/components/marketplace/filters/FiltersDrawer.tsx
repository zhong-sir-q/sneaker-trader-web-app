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
  display: block;
  text-align: end;
`;

type FiltersDrawerProps = { sizeFilters: string[]; brandFilters: string[] };

const FiltersDrawer = (props: FiltersDrawerProps) => {
  const { sizeFilters, brandFilters } = props;

  const { open, onOpen, onClose } = useOpenCloseComp();
  const { numFilters, clearFilters } = useMarketPlaceCtx();

  return (
    <React.Fragment>
      <CollapseButtonDiv>
        <Button onClick={onOpen}>Filter</Button>
      </CollapseButtonDiv>
      {/* the user cannot close the drawer by clicking the outside */}
      <Drawer anchor='bottom' open={open}>
        <MuiCloseButton onClick={onClose} />
        <div style={{ padding: '50px', overflow: 'auto', paddingBottom: 0 }}>
          <FilterButtonWrapper>
            <FilterButtons filterKey='size' filters={sizeFilters} title='us sizes' />
          </FilterButtonWrapper>
          <CheckboxFilters filterKey='brand' filters={brandFilters} title='brands' />
        </div>
        {numFilters > 0 && (
          <div style={{ display: 'flex', padding: '20px 50px' }}>
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

const FilterButtonWrapper = styled.div`
  margin-bottom: 22px;
`;

export default FiltersDrawer;
