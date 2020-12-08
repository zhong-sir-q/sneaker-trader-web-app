import React, { useState, useEffect } from 'react';
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

import heroSplashImg from 'assets/img/aj1-splash.jpg';

import { SearchBarSneaker } from '../../../shared';

import { MD_WIDTH } from 'const/variables';

const FilterGroup = styled(Col)`
  min-width: 200px;

  @media (max-width: ${MD_WIDTH}) {
    display: none;
  }
`;

const Grid = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1em;

  @media (max-width: ${MD_WIDTH}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SkeletonPlaceHolder = styled.div`
  padding-top: 66.6%;
`;

const SkeletonWrapper = styled.div`
  min-height: calc(100vh - 150px);
  width: 100%;
  padding: 2% 10%;
`;

const Wrapper = styled.div`
  min-height: calc(100vh - 150px);
  width: 100%;
  padding: 0 6%;
  display: flex;
  justify-content: center;

  @media (max-width: ${MD_WIDTH}) {
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

  @media (min-width: ${MD_WIDTH}) {
    display: none;
  }
`;

const MarketPlace = () => {
  const { defaultSneakers, filterSneakers, brands, isFetching } = useMarketPlaceCtx();
  // lag some time to allow the sneakers to be
  // fetched first then render the filters
  const [lagging, setLagging] = useState(true);

  // 1.5s to load the sneakers, then we show the filters
  // there should be a better solution than this
  useEffect(() => {
    setTimeout(() => setLagging(false), 1500);
  }, []);

  const history = useHistory();

  const sizeFilters = _.range(3, 15, 0.5);

  const navigateBuySneakerPage = (sneaker: SearchBarSneaker) =>
    redirectBuySneakerPage(history, sneaker.name, sneaker.colorway);

  if (!filterSneakers)
    return (
      <SkeletonWrapper>
        <SkeletonGrid />
      </SkeletonWrapper>
    );

  return (
    <React.Fragment>
      <Hero img={heroSplashImg}>
        <Jumbo>
          <JumboHeader>
            <JumboHeaderText>Get your sneakers before Xmas</JumboHeaderText>
            <JumboSubHeaderText>The Place to get your Kicks for the holidays</JumboSubHeaderText>
          </JumboHeader>
        </Jumbo>
        <SearchBarRow>
          <SneakerSearchBar width='100%' sneakers={defaultSneakers || []} onChooseSneaker={navigateBuySneakerPage} />
        </SearchBarRow>
      </Hero>
      <Wrapper>
        <MobileWrapper>
          <TopGradient />
          {!lagging && (
            <React.Fragment>
              <FiltersDrawer brandFilters={brands || []} sizeFilters={sizeFilters.map((n) => String(n))} />
              <SneakerSearchBar
                width='100%'
                sneakers={defaultSneakers || []}
                onChooseSneaker={navigateBuySneakerPage}
              />
            </React.Fragment>
          )}
        </MobileWrapper>
        {!lagging && (
          <FilterGroup md={2} lg={2}>
            <FilterButtonWrapper>
              <FilterButtons filterKey='size' filters={sizeFilters.map((size) => String(size))} title='us sizes' />
            </FilterButtonWrapper>
            <CheckboxFilters filterKey='brand' filters={brands || []} title='brands' />
          </FilterGroup>
        )}
        {isFetching ? (
          <SkeletonWrapper>
            <SkeletonGrid />
          </SkeletonWrapper>
        ) : (
          <SneakerGallery sneakers={filterSneakers || []} />
        )}
      </Wrapper>
    </React.Fragment>
  );
};

const SearchBarRow = styled.div`
  max-width: 720px;
  margin: auto;
`;

const FilterButtonWrapper = styled.div`
  margin-bottom: 22px;
`;

type HeroProps = {
  img: string;
};

const Hero = styled.div<HeroProps>`
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #000;
  text-align: center;
  background-image: url(${({ img }) => `"${img}"`});
  height: 80vh;
  margin-top: 0;
  padding-top: 25vh;
  margin-bottom: 25px;

  @media (max-width: ${MD_WIDTH}) {
    display: none;
  }
`;

const Jumbo = styled.div`
  color: #fff;
`;

const JumboHeader = styled.h1`
  font-family: RingsideWideSSm-Medium_Web, sans-serif;
  padding-left: 10px;
  padding-right: 10px;
  letter-spacing: 2px;
  font-size: 3rem;
  margin: auto auto 20px;
`;

const JumboHeaderText = styled.span`
  display: block;
  margin-bottom: 10px;
  letter-spacing: -1px;
`;

const JumboSubHeaderText = styled(JumboHeaderText)`
  display: inline-block;
  padding: 10px;
  background-color: black;
`;

const TopGradient = styled.div`
  height: 80px;
  background: linear-gradient(#e5e5e5, #f5f5f5, #fff, #fff);
  background-color: #fff;
`;

export default MarketPlace;
