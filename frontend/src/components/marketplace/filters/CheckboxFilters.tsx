import React from 'react';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

import styled from 'styled-components';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { FilterWrapper, ArrowDirectionWrapper, FilterTitle } from './FilterHelpers';

import { FiltersProps } from './filter';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';
import { Collapse } from 'reactstrap';

import SimpleBar from 'simplebar-react';
// keep the css for custom scrollbar style
import 'simplebar/dist/simplebar.min.css';

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

// attempt to change the height of the scrollbar but does not work
const StyledSimpleBar = styled(SimpleBar)``;

const CheckboxWrapper = styled.div<{ fetching: boolean }>`
  position: relative;
  opacity: ${({ fetching }) => (fetching ? 0.5 : undefined)};
`;

const CheckboxFilters = (props: Omit<FiltersProps, 'filterSelected'>) => {
  const { filters, filterKey, title } = props;

  const { onSelectFilter, isFilterSelected, isFetching } = useMarketPlaceCtx();
  const { open, toggle } = useOpenCloseComp(true);

  const onCheck = (value: string) => {
    if (!isFetching) onSelectFilter(filterKey, value);
  };

  return (
    <React.Fragment>
      <FilterTitle onClick={toggle}>
        <span>{title}</span>
        <ArrowDirectionWrapper>{open ? <ArrowDropUp /> : <ArrowDropDown />}</ArrowDirectionWrapper>
      </FilterTitle>
      <Collapse isOpen={open}>
        <StyledSimpleBar style={{ maxHeight: 215 }}>
          <FilterWrapper>
            {filters.map((val, idx) => (
              // the wrapper is still clickable, dim the opacity to create an illusion that it is disabled
              <CheckboxWrapper fetching={isFetching} key={idx} onClick={() => onCheck(val)}>
                <CheckboxLabel>{val}</CheckboxLabel>
                <CheckMark checked={isFilterSelected(val)} />
              </CheckboxWrapper>
            ))}
          </FilterWrapper>
        </StyledSimpleBar>
      </Collapse>
    </React.Fragment>
  );
};

export default CheckboxFilters;
