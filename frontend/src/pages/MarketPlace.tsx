import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Container, Button, Label, Collapse } from 'reactstrap';
import { Drawer, IconButton, makeStyles } from '@material-ui/core';

import styled from 'styled-components';

import _ from 'lodash';

import SneakerGallery from 'components/SneakerGallery';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { useAuth } from 'providers/AuthProvider';

import { range } from 'utils/utils';
import { GallerySneaker } from '../../../shared';
import CenterSpinner from 'components/CenterSpinner';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { ArrowDropUp, ArrowDropDown, Close } from '@material-ui/icons';

type FilterBlockProps = { selected: boolean };

const FilterTitle = styled.div`
  font-family: proxima-nova, sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 7px;
  letter-spacing: 1px;
  position: relative;
  cursor: pointer;
`;

const FilterGroup = styled(Col)`
  min-width: 200px;

  @media (max-width: 786px) {
    display: none;
  }
`;

const CollapseButtonDiv = styled.div`
  text-align: end;
  display: block;

  @media (min-width: 786px) {
    display: none;
  }
`;

const FilterButton = styled.button<FilterBlockProps>`
  text-align: center;
  border: 1px solid rgb(229, 229, 229);
  border-radius: 5px;
  margin-right: 6px;
  margin-bottom: 6px;
  flex: 0%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  background: transparent;
  color: ${(props) => (props.selected ? '#f96332' : '')};
`;

const FilterButtonText = styled.span`
  padding: 0px 0.5em;
  white-space: nowrap;
  display: block;
`;

type FilterByKey = 'brand' | 'size';
type SelectFilterHandler = (filterKey: FilterByKey, filter: string) => void;
type FilterSelectedFunc = (filterVal: string) => boolean;

type FiltersProps = {
  filters: string[];
  filterKey: FilterByKey;
  title: string;
  onSelectFilter: SelectFilterHandler;
  filterSelected: FilterSelectedFunc;
};

const CheckboxInput = styled.input`
  vertical-align: middle;
  cursor: pointer;
`;

const FilterWrapper = styled.div`
  margin-bottom: 15px;
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

const ArrowDirectionWrapper = styled.div`
  position: absolute;
  top: 13px;
  right: 2px;
  transform: translateY(-50%);
`;

const ButtonFilters = (props: FiltersProps) => {
  const { filters, filterKey, title, onSelectFilter, filterSelected } = props;

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
            <FilterButton onClick={() => onSelectFilter(filterKey, val)} selected={filterSelected(val)} key={idx}>
              <FilterButtonText>{val}</FilterButtonText>
            </FilterButton>
          ))}
        </Row>
      </Collapse>
    </FilterWrapper>
  );
};

type FilterItemType = {
  key: FilterByKey;
  value: string;
};

type FiltersDrawerProps = { sizeFilters: string[]; brandFilters: string[] } & Pick<
  FiltersProps,
  'onSelectFilter' | 'filterSelected'
>;

const useDrawerStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    outline: 'none',
  },
}));

const FiltersDrawer = (props: FiltersDrawerProps) => {
  const { sizeFilters, brandFilters, onSelectFilter, filterSelected } = props;

  const { open, onOpen, onClose } = useOpenCloseComp();

  const classes = useDrawerStyles()

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

const MarketPlace = () => {
  const { currentUser } = useAuth();
  const { defaultSneakers, filterSneakers, brands, updateFilterSneakers } = useMarketPlaceCtx();

  const [filters, setFilters] = useState<FilterItemType[]>([]);

  const getSneakerBySizes = async (sizes: number[], sellerId: number) => {
    const nestedSneakers = await Promise.all(
      sizes.map((size) => ListedSneakerControllerInstance.getGallerySneakersBySize(sellerId, size))
    );

    const flattenedSneakers = _.flatten(nestedSneakers);
    const uniqSneakersByNameColorway = _.uniqBy(flattenedSneakers, (sneaker) => sneaker.name + sneaker.colorway);

    return uniqSneakersByNameColorway;
  };

  // TODO: use a reducer instead
  const filterHandler = useCallback(async () => {
    if (!defaultSneakers) return;

    const sizes = filters.filter((f) => f.key === 'size').map((item) => Number(item.value));
    const brands = filters.filter((f) => f.key === 'brand').map((item) => item.value);

    const filterByBrands = (sneakers: GallerySneaker[], brands: string[]) =>
      sneakers.filter((s) => brands.includes(s.brand));

    if (!_.isEmpty(sizes) && !_.isEmpty(brands)) {
      const sneakerBySizes = await getSneakerBySizes(sizes, currentUser ? currentUser.id : -1);
      updateFilterSneakers(filterByBrands(sneakerBySizes, brands as string[]));
    } else if (!_.isEmpty(sizes)) {
      const sneakerBySizes = await getSneakerBySizes(sizes, currentUser ? currentUser.id : -1);
      updateFilterSneakers(sneakerBySizes);
    } else if (!_.isEmpty(brands)) updateFilterSneakers(filterByBrands(defaultSneakers, brands as string[]));
    else updateFilterSneakers(defaultSneakers);
  }, [currentUser, defaultSneakers, filters, updateFilterSneakers]);

  useEffect(() => {
    filterHandler();
  }, [filterHandler]);

  const filterSelected = (selectedVal: string) => filters.findIndex((f) => f.value === selectedVal) > -1;

  const onSelectFilter = (filterKey: FilterByKey, filter: string) => {
    if (filterSelected(String(filter))) setFilters(filters.filter((f) => f.value !== filter));
    else setFilters([...filters, { key: filterKey, value: String(filter) }]);
  };

  return !brands || !filterSneakers ? (
    <CenterSpinner />
  ) : (
    <Container fluid='md' style={{ minHeight: 'calc(100vh - 150px)' }}>
      <FiltersDrawer
        onSelectFilter={onSelectFilter}
        filterSelected={filterSelected}
        brandFilters={brands}
        sizeFilters={range(3, 14, 0.5).map((n) => String(n))}
      />
      <div className='flex'>
        <FilterGroup md={2} lg={2}>
          <ButtonFilters
            onSelectFilter={onSelectFilter}
            filterSelected={filterSelected}
            filterKey='size'
            filters={range(3.5, 15.5, 0.5).map((size) => String(size))}
            title='us sizes'
          />

          <CheckboxFilters onSelectFilter={onSelectFilter} filterKey='brand' filters={brands} title='brands' />
        </FilterGroup>
        <SneakerGallery sneakers={filterSneakers} />
      </div>
    </Container>
  );
};

export default MarketPlace;
