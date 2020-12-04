import React from 'react';
import { Col, Container } from 'reactstrap';

import styled from 'styled-components';

import SneakerGallery from 'components/SneakerGallery';
import FiltersDrawer from 'components/marketplace/filters/FiltersDrawer';
import ButtonFilters from 'components/marketplace/filters/FilterButtons';
import CheckboxFilters from 'components/marketplace/filters/CheckboxFilters';

import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

import _ from 'lodash';
import { Skeleton } from '@material-ui/lab';

const FilterGroup = styled(Col)`
  min-width: 200px;

  @media (max-width: 786px) {
    display: none;
  }
`;

const Grid = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1em;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PlaceHolder = styled.div`
  padding-top: 66.6%;
`;

const FullContainer = styled(Container)`
  min-height: calc(100vh - 150px);
`;

const SkeletonGrid = () => {
  return (
    <Grid>
      {Array(18)
        .fill(0)
        .map((_, idx) => (
          <Skeleton key={idx} width='100%'>
            <PlaceHolder />
          </Skeleton>
        ))}
    </Grid>
  );
};

const MarketPlace = () => {
  const { filterSneakers, brands } = useMarketPlaceCtx();

  if (!filterSneakers || !brands)
    return (
      <FullContainer>
        <SkeletonGrid />
      </FullContainer>
    );

  return (
    <FullContainer>
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
        <SneakerGallery sneakers={filterSneakers} />
      </div>
    </FullContainer>
  );
};

export default MarketPlace;
