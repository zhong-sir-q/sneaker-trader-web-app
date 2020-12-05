import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { Collapse, Label } from 'reactstrap';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, ArrowDirectionWrapper, FilterTitle } from './FilterHelpers';

import { FiltersProps } from './filter';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

const CheckboxLabel = styled.label`
  /* 10 + 20 where 20 is the width of the checkbox */
  padding-left: 30px;
  margin-bottom: 5px;

  ::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid blue;
    left: 0;
    top: 0;
    opacity: 0.6;
    transition: all 0.12s, border-color 0.08s;
  }
`;

const CheckMark = styled.span`
  ::after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;

const CheckboxWrapper = styled.div`
  position: relative;
`;

const CheckboxFilters = (props: Omit<FiltersProps, 'filterSelected'>) => {
  const { filters, filterKey, title } = props;

  const { onSelectFilter, isFilterSelected } = useMarketPlaceCtx();
  const { open, toggle } = useOpenCloseComp(true);

  return (
    <React.Fragment>
      <FilterTitle onClick={toggle}>
        <span>{title}</span>
        <ArrowDirectionWrapper>{open ? <ArrowDropUp /> : <ArrowDropDown />}</ArrowDirectionWrapper>
      </FilterTitle>
      <FilterWrapper>
        {filters.map((val, idx) => (
          <CheckboxWrapper key={idx} onClick={() => onSelectFilter(filterKey, val)}>
            {/* <input
              style={{ display: isFilterSelected(val) ? 'block' : 'none' }}
              type='checkbox'
              checked={isFilterSelected(val)}
            /> */}
            <CheckboxLabel>{val}</CheckboxLabel>
            <CheckMark />
          </CheckboxWrapper>
          // <Label style={{ display: 'block' }} key={idx}>
          //   <CheckboxInput
          // type='checkbox'
          // checked={isFilterSelected(val)}
          // onChange={() => onSelectFilter(filterKey, val)}
          //   />{' '}
          //   {val}
          // </Label>
        ))}
        {/* <Collapse isOpen={open}>
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
      </Collapse> */}
      </FilterWrapper>
    </React.Fragment>
  );
};

export default CheckboxFilters;
