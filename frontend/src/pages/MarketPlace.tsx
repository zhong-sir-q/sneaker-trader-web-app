import React from 'react';
import { Col } from 'reactstrap';

import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';

import _ from 'lodash';
import { useHistory } from 'react-router-dom';

import SneakerGallery from 'components/SneakerGallery';
import FiltersDrawer from 'components/marketplace/filters/FiltersDrawer';
import CheckboxFilters from 'components/marketplace/filters/CheckboxFilters';

import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

import FilterButtons from 'components/marketplace/filters/FilterButtons';
import SneakerSearchBar from 'components/SneakerSearchBar';

import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';

import { SearchBarSneaker } from '../../../shared';

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

const SkeletonPlaceHolder = styled.div`
  padding-top: 66.6%;
`;

const SkeletonWrapper = styled.div`
  min-height: calc(100vh - 150px);
  width: 100%;
`;

const Wrapper = styled.div`
  min-height: calc(100vh - 150px);
  width: 100%;
  padding: 0 6%;
  display: flex;

  @media (max-width: 786px) {
    padding: 0;
    flex-direction: column;
  }
`;

const SkeletonGrid = () => {
  return (
    <Grid>
      {Array(24)
        .fill(0)
        .map((_, idx) => (
          <Skeleton key={idx} width='100%'>
            <SkeletonPlaceHolder />
          </Skeleton>
        ))}
    </Grid>
  );
};

// only show on small screen
const MobileWrapper = styled.div`
  margin-bottom: 8px;
  margin-left: 4px;
  margin-right: 4px;

  @media (min-width: 786px) {
    display: none;
  }
`;

const MarketPlace = () => {
  const { defaultSneakers, filterSneakers, brands, isFetching } = useMarketPlaceCtx();

  const history = useHistory();

  if (!filterSneakers || !brands)
    return (
      <SkeletonWrapper>
        <SkeletonGrid />
      </SkeletonWrapper>
    );

  const sizeFilters = _.range(3, 15, 0.5);

  const navigateBuySneakerPage = (sneaker: SearchBarSneaker) =>
    redirectBuySneakerPage(history, sneaker.name, sneaker.colorway);

  return (
    <Wrapper>
      <MobileWrapper>
        <FiltersDrawer brandFilters={brands} sizeFilters={sizeFilters.map((n) => String(n))} />
          <SneakerSearchBar width='100%' sneakers={defaultSneakers || []} onChooseSneaker={navigateBuySneakerPage} />
      </MobileWrapper>
      <FilterGroup md={2} lg={2}>
        <FilterButtonWrapper>
          <FilterButtons filterKey='size' filters={sizeFilters.map((size) => String(size))} title='us sizes' />
        </FilterButtonWrapper>
        <CheckboxFilters filterKey='brand' filters={brands} title='brands' />
      </FilterGroup>
      {isFetching ? (
        <SkeletonWrapper>
          <SkeletonGrid />
        </SkeletonWrapper>
      ) : (
        <SneakerGallery sneakers={filterSneakers} />
      )}
    </Wrapper>
  );
};

const FilterButtonWrapper = styled.div`
  margin-bottom: 22px;
`;

export default MarketPlace;
