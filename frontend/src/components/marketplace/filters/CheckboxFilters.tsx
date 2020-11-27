import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { Collapse, Label } from 'reactstrap';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, ArrowDirectionWrapper, FilterTitle } from './FilterHelpers';

import { FiltersProps } from './filter';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

const CheckboxInput = styled.input`
  vertical-align: middle;
  cursor: pointer;
`;

const CheckboxFilters = (props: Omit<FiltersProps, 'filterSelected'>) => {
  const { filters, filterKey, title } = props;

  const { onSelectFilter, isFilterSelected } = useMarketPlaceCtx();
  const { open, toggle } = useOpenCloseComp(true);

  return (
    <FilterWrapper>
      <FilterTitle onClick={toggle}>
        <span>{title}</span>
        <ArrowDirectionWrapper>{open ? <ArrowDropUp /> : <ArrowDropDown />}</ArrowDirectionWrapper>
      </FilterTitle>
      <Collapse isOpen={open}>
        {filters.map((val, idx) => (
          <Label style={{ display: 'block' }} key={idx}>
            <CheckboxInput
              type='checkbox'
              checked={isFilterSelected(val)}
              onChange={() => onSelectFilter(filterKey, val)}
            />{' '}
            {val}
          </Label>
        ))}
      </Collapse>
    </FilterWrapper>
  );
};

export default CheckboxFilters;
