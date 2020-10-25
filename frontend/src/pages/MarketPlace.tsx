import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container } from 'reactstrap';

import styled from 'styled-components';

import _ from 'lodash';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

import { useAuth } from 'providers/AuthProvider';

import { range } from 'utils/utils';
import { GallerySneaker } from '../../../shared';

import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

import SneakerGallery from 'components/SneakerGallery';

import CenterSpinner from 'components/CenterSpinner';

import FiltersDrawer from 'components/marketplace/filters/FiltersDrawer';
import ButtonFilters from 'components/marketplace/filters/ButtonFilters';
import CheckboxFilters from 'components/marketplace/filters/CheckboxFilters';

import { FilterByKey } from 'components/marketplace/filters/filter';

const FilterGroup = styled(Col)`
  min-width: 200px;

  @media (max-width: 786px) {
    display: none;
  }
`;

type FilterItemType = {
  key: FilterByKey;
  value: string;
};

const getSneakersBySizes = async (sizes: number[], sellerId: number) => {
  const nestedSneakers = await Promise.all(
    sizes.map((size) => ListedSneakerControllerInstance.getGallerySneakersBySize(sellerId, size))
  );

  const flattenedSneakers = _.flatten(nestedSneakers);
  const uniqSneakersByNameColorway = _.uniqBy(flattenedSneakers, (sneaker) => sneaker.name + sneaker.colorway);

  return uniqSneakersByNameColorway;
};

const filterByBrands = (sneakers: GallerySneaker[], brands: string[]) =>
    sneakers.filter((s) => brands.includes(s.brand));

const MarketPlace = () => {
  const { currentUser } = useAuth();
  const { defaultSneakers, filterSneakers, brands, updateFilterSneakers } = useMarketPlaceCtx();

  const [filters, setFilters] = useState<FilterItemType[]>([]);

  const filterHandler = useCallback(async () => {
    if (!defaultSneakers) return;

    const sizes = filters.filter((f) => f.key === 'size').map((item) => Number(item.value));
    const brands = filters.filter((f) => f.key === 'brand').map((item) => item.value);
    const userId = currentUser ? currentUser.id : -1;
    
    // filter by brands and sizes
    if (!_.isEmpty(sizes) && !_.isEmpty(brands)) {
      const sneakersBySizes = await getSneakersBySizes(sizes, userId);
      const sneakersBySizesAndBrands = filterByBrands(sneakersBySizes, brands);
      updateFilterSneakers(sneakersBySizesAndBrands);
    // filter by sizes only
    } else if (!_.isEmpty(sizes)) {
      const sneakersBySizes = await getSneakersBySizes(sizes, userId);
      updateFilterSneakers(sneakersBySizes);
    // filter by brands only
    } else if (!_.isEmpty(brands)) {
      const sneakersByBrands = filterByBrands(defaultSneakers, brands);
      updateFilterSneakers(sneakersByBrands);
    // reset the states
    } else updateFilterSneakers(defaultSneakers);
  }, [currentUser, defaultSneakers, filters, updateFilterSneakers]);

  useEffect(() => {
    filterHandler();
  }, [filterHandler]);

  const filterSelected = (selectedVal: string) => filters.findIndex((f) => f.value === selectedVal) > -1;

  const onSelectFilter = (filterKey: FilterByKey, filter: string) => {
    // unselect the filter if it is already selected
    if (filterSelected(String(filter))) setFilters(filters.filter((f) => f.value !== filter));
    // otherwise add it to the selected filters
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
