import React from 'react';
import { Col, Container } from 'reactstrap';

import styled from 'styled-components';

import SneakerGallery from 'components/SneakerGallery';
import CenterSpinner from 'components/CenterSpinner';
import FiltersDrawer from 'components/marketplace/filters/FiltersDrawer';
import ButtonFilters from 'components/marketplace/filters/FilterButtons';
import CheckboxFilters from 'components/marketplace/filters/CheckboxFilters';

import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

import { range } from 'utils/utils';


const FilterGroup = styled(Col)`
  min-width: 200px;

  @media (max-width: 786px) {
    display: none;
  }
`;

const MarketPlace = () => {
  const { filterSneakers, brands } = useMarketPlaceCtx();

  return !brands || !filterSneakers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(100vh - 150px)' }}>
      <FiltersDrawer
        brandFilters={brands}
        sizeFilters={range(3, 14, 0.5).map((n) => String(n))}
      />
      <div className='flex'>
        <FilterGroup md={2} lg={2}>
          <ButtonFilters
            filterKey='size'
            filters={range(3.5, 15.5, 0.5).map((size) => String(size))}
            title='us sizes'
          />

          <CheckboxFilters filterKey='brand' filters={brands} title='brands' />
        </FilterGroup>
        <SneakerGallery sneakers={filterSneakers} />
      </div>
    </Container>
  );
};

export default MarketPlace;
