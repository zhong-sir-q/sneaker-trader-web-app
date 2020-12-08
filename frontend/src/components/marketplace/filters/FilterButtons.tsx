import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { Collapse, Row } from 'reactstrap';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, FilterTitle, ArrowDirectionWrapper } from './FilterHelpers';

import { FiltersProps, FilterButtonProps } from './filter';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

import SimpleBar from 'simplebar-react';
// keep the css for custom scrollbar style
import 'simplebar/dist/simplebar.min.css';

const FilterButton = styled.button<FilterButtonProps>`
  border: 1px solid rgb(229, 229, 229);
  margin-right: 6px;
  margin-bottom: 6px;
  background: transparent;
  display: flex;
  justify-content: center;
  padding: 0.65625em;
  /* width 0 and flex makes all the flex item the same size */
  width: 0;
  flex: 1 1 25%;
  border-bottom: ${({ selected }) => (selected ? '2px solid black' : '1px solid rgb(229, 229, 229)')};
  font-weight: ${({ selected }) => (selected ? '700' : '')};

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

  const { isFetching, onSelectFilter, isFilterSelected } = useMarketPlaceCtx();

  const { open, toggle } = useOpenCloseComp(true);

  return (
    <React.Fragment>
      <FilterTitle onClick={toggle}>
        <span>{title}</span>
        <ArrowDirectionWrapper>{open ? <ArrowDropUp /> : <ArrowDropDown />}</ArrowDirectionWrapper>
      </FilterTitle>
      <Collapse isOpen={open}>
        <SimpleBar style={{ maxHeight: 215 }}>
          <FilterWrapper>
            <Row style={{ margin: 0 }}>
              {filters.map((val, idx) => (
                <FilterButton
                  onClick={() => onSelectFilter(filterKey, val)}
                  selected={isFilterSelected(val)}
                  // disable the button when the parent is fetching some data
                  disabled={isFetching}
                  key={idx}
                >
                  <FilterButtonText>{val}</FilterButtonText>
                </FilterButton>
              ))}
            </Row>
          </FilterWrapper>
        </SimpleBar>
      </Collapse>
    </React.Fragment>
  );
};

export default FilterButtons;
