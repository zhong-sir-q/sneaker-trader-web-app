import React from 'react';
import { Col, Container } from 'reactstrap';

import styled from 'styled-components';

import SneakerGallery from 'components/SneakerGallery';
import CenterSpinner from 'components/CenterSpinner';
import FiltersDrawer from 'components/marketplace/filters/FiltersDrawer';
import ButtonFilters from 'components/marketplace/filters/FilterButtons';
import CheckboxFilters from 'components/marketplace/filters/CheckboxFilters';

import InfiniteScroll from 'react-infinite-scroll-component';

import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

import _ from 'lodash';

const FilterGroup = styled(Col)`
  min-width: 200px;

  @media (max-width: 786px) {
    display: none;
  }
`;

const MarketPlace = () => {
  const { filterSneakers, brands, hasMoreListedSneakers, fetchMoreListedSneakers } = useMarketPlaceCtx();

  return !brands || !filterSneakers ? (
    <CenterSpinner />
  ) : (
    <Container style={{ minHeight: 'calc(100vh - 150px)' }}>
      <FiltersDrawer brandFilters={brands} sizeFilters={_.range(3, 14, 0.5).map((n) => String(n))} />
      <div className='flex'>
        <FilterGroup md={2} lg={2}>
          <ButtonFilters
            filterKey='size'
            filters={_.range(3.5, 15.5, 0.5).map((size) => String(size))}
            title='us sizes'
          />

          <CheckboxFilters filterKey='brand' filters={brands} title='brands' />
        </FilterGroup>
        <InfiniteScroll
          dataLength={filterSneakers.length}
          next={fetchMoreListedSneakers}
          hasMore={hasMoreListedSneakers}
          loader={<h4 className='text-center'>Loading...</h4>}
        >
          <SneakerGallery sneakers={filterSneakers} />
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default MarketPlace;
