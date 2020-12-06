import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, ArrowDirectionWrapper, FilterTitle } from './FilterHelpers';

import { FiltersProps } from './filter';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

type CheckMarkProps = {
  checked: boolean;
};

const CheckMark = styled.div<CheckMarkProps>`
  position: absolute;
  display: ${(props) => (props.checked ? 'inline-block' : 'none')};
  width: 20px;
  height: 20px;
  left: 0;
  top: -3px;

  ::before {
    position: absolute;
    left: 0;
    top: 50%;
    height: 50%;
    width: 3px;
    background-color: #336699;
    content: '';
    transform: translateX(10px) rotate(-45deg);
    transform-origin: left bottom;
    transition: all 0.12s, border-color 0.08s;
  }

  ::after {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    background-color: #336699;
    content: '';
    /* use translate to offset the distance at  */
    transform: translateX(10px) rotate(-45deg);
    transform-origin: left bottom;
  }
`;

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
      {open && (
        <FilterWrapper>
          {filters.map((val, idx) => (
            <CheckboxWrapper key={idx} onClick={() => onSelectFilter(filterKey, val)}>
              <CheckboxLabel>{val}</CheckboxLabel>
              <CheckMark checked={isFilterSelected(val)} />
            </CheckboxWrapper>
          ))}
        </FilterWrapper>
      )}
    </React.Fragment>
  );
};

export default CheckboxFilters;
