import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { Collapse, Label } from 'reactstrap';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, ArrowDirectionWrapper, FilterTitle } from './FilterHelpers';

import { FiltersProps } from './filter';

const CheckboxInput = styled.input`
  vertical-align: middle;
  cursor: pointer;
`;

const CheckboxFilters = (props: Omit<FiltersProps, 'filterSelected'>) => {
  const { filters, filterKey, title, onSelectFilter } = props;

  const { open, toggle } = useOpenCloseComp(true);

  return (
    <FilterWrapper>
      <FilterTitle onClick={toggle}>
        <span>{title}</span>
        <ArrowDirectionWrapper>{open ? <ArrowDropUp /> : <ArrowDropDown />}</ArrowDirectionWrapper>
      </FilterTitle>
      <Collapse isOpen={open}>
        {filters.map((val, idx) => (
          <div key={idx}>
            <Label>
              <CheckboxInput type='checkbox' onClick={() => onSelectFilter(filterKey, val)} /> {val}
            </Label>
          </div>
        ))}
      </Collapse>
    </FilterWrapper>
  );
};

export default CheckboxFilters;
