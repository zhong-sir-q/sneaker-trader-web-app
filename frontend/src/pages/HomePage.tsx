import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Container, Button } from 'reactstrap';
import { Drawer } from '@material-ui/core';

import styled from 'styled-components';

import _ from 'lodash';

import SneakerGallery from 'components/SneakerGallery';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { useAuth } from 'providers/AuthProvider';

import { range } from 'utils/utils';
import { GallerySneaker } from '../../../shared';
import CenterSpinner from 'components/CenterSpinner';
import { useHomePageCtx } from 'providers/marketplace/HomePageCtxProvider';


type FilterBlockProps = { selected: boolean };

const FilterBlock = styled(Col)<FilterBlockProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  font-family: BebasNeue;
  background-color: #f5f5f5;
  margin: 3px;
  cursor: pointer;
  color: ${(props) => (props.selected ? '#f96332' : '')};
`;

const FilterTitle = styled.div`
  font-family: proxima-nova, sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 7px;
  letter-spacing: 1px;
`;

const CollapseFilters = styled(Col)`
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

const Filters = (props: FiltersProps) => {
  const { filters, filterKey, title, onSelectFilter, filterSelected } = props;

  return (
    <div style={{ marginBottom: '25px' }}>
      <FilterTitle>{title}</FilterTitle>
      <Row>
        {filters.map((val, idx) => (
          <FilterBlock onClick={() => onSelectFilter(filterKey, val)} selected={filterSelected(String(val))} key={idx}>
            {val}
          </FilterBlock>
        ))}
      </Row>
    </div>
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

const FiltersDrawer = (props: FiltersDrawerProps) => {
  const [open, setOpen] = useState(false);

  const { sizeFilters, brandFilters, onSelectFilter, filterSelected } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <CollapseButtonDiv>
        <Button onClick={handleOpen}>Filter</Button>
      </CollapseButtonDiv>
      <Drawer anchor='bottom' open={open} onClose={handleClose}>
        <div style={{ padding: '50px' }}>
          <Filters
            onSelectFilter={onSelectFilter}
            filterSelected={filterSelected}
            filterKey='size'
            filters={sizeFilters}
            title='us sizes'
          />
          <Filters
            onSelectFilter={onSelectFilter}
            filterSelected={filterSelected}
            filterKey='brand'
            filters={brandFilters}
            title='brands'
          />
        </div>
      </Drawer>
    </React.Fragment>
  );
};

const HomePage = () => {
  const { currentUser } = useAuth();
  const { defaultSneakers, filterSneakers, brands, updateFilterSneakers } = useHomePageCtx();

  const [filters, setFilters] = useState<FilterItemType[]>([]);

  const getSneakerBySizes = async (sizes: number[], sellerId: number) => {
    const nestedSneakers = await Promise.all(
      sizes.map((size) => ListedSneakerControllerInstance.getGallerySneakersBySize(sellerId, size))
    );

    const flattenedSneakers = _.flatten(nestedSneakers);
    const uniqSneakersByNameColorway = _.uniqBy(flattenedSneakers, (sneaker) => sneaker.name + sneaker.colorway);

    return uniqSneakersByNameColorway;
  };

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
    <Container fluid='sm' style={{ minHeight: 'calc(100vh - 150px)' }}>
      <FiltersDrawer
        onSelectFilter={onSelectFilter}
        filterSelected={filterSelected}
        brandFilters={brands}
        sizeFilters={range(3, 14, 0.5).map((n) => String(n))}
      />
      <Row>
        <CollapseFilters md={2} lg={2}>
          <Filters
            onSelectFilter={onSelectFilter}
            filterSelected={filterSelected}
            filters={range(3, 14, 0.5).map((n) => String(n))}
            filterKey='size'
            title='us sizes'
          />
          <Filters
            onSelectFilter={onSelectFilter}
            filterSelected={filterSelected}
            filters={brands}
            filterKey='brand'
            title='brands'
          />
        </CollapseFilters>
        <Col sm={12} md={10} lg={10}>
          <SneakerGallery sneakers={filterSneakers} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
