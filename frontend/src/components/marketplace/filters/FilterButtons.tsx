import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { Collapse, Row } from 'reactstrap';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, FilterTitle, ArrowDirectionWrapper } from './FilterHelpers';

import { FiltersProps, FilterButtonProps } from './filter';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

const FilterButton = styled.button<FilterButtonProps>`
  border: 1px solid rgb(229, 229, 229);
  border-radius: 5px;
  margin-right: 6px;
  margin-bottom: 6px;
  background: transparent;
  color: ${(props) => (props.selected ? '#f96332' : '')};
  display: flex;
  justify-content: center;
  padding: 3.5px;
  /* width 0 and flex makes all the flex item the same size */
  width: 0;
  flex: 1 1 25%;

  &:focus {
    outline: none;
  }
`;

const FilterButtonText = styled.span`
  padding: 0px 0.5em;
  white-space: nowrap;
  display: block;
`;

const FilterButtons = (props: FiltersProps) => {
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
        <Row style={{ margin: 0 }}>
          {filters.map((val, idx) => (
            <FilterButton onClick={() => onSelectFilter(filterKey, val)} selected={isFilterSelected(val)} key={idx}>
              <FilterButtonText>{val}</FilterButtonText>
            </FilterButton>
          ))}
        </Row>
      </Collapse>
    </FilterWrapper>
  );
};

export default FilterButtons;
