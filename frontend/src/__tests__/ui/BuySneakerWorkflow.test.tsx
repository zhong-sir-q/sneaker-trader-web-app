import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import HomeLayout from 'layouts/HomeLayout';

import faker from 'faker';

import { ListedSneakerRoutesCtx, renderListedSneakerRoutes } from 'providers/ListedSneakerRoutesProvider';

import fakeGetListedSneaker from '__mocks__/data/fakeGetListedSneaker';
import fakeGallerySneaker from '__mocks__/data/fakeGallerySneaker';
import { MarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';

const MOCK_INIT_LISTED_SNEAKERS = Array(10)
  .fill(0)
  .map((_) => fakeGetListedSneaker(faker.random.number(), faker.random.number()));

const MockListedSneakerRoutesProvider = (props: { children: React.ReactNode }) => {
  const [listedSneakerRoutes, setListedSneakerRoutes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    (async () => {
      setListedSneakerRoutes(await renderListedSneakerRoutes(MOCK_INIT_LISTED_SNEAKERS));
    })();
  }, []);

  return (
    <ListedSneakerRoutesCtx.Provider value={{ listedSneakerRoutes }}>{props.children}</ListedSneakerRoutesCtx.Provider>
  );
};

const NUM_MARKET_PLACE_SNEAKERS = 20;
const mockGallerySneakers = Array(NUM_MARKET_PLACE_SNEAKERS)
  .fill(0)
  .map((_) => fakeGallerySneaker());

const MockMarketPlaceProvider = (props: { children: React.ReactNode }) => {
  return (
    <MarketPlaceCtx.Provider
      value={{
        defaultSneakers: mockGallerySneakers,
        filterSneakers: mockGallerySneakers,
        brands: [],
        updateFilterSneakers: jest.fn(() => {}),
      }}
    >
      {props.children}
    </MarketPlaceCtx.Provider>
  );
};

describe('Buying a pair of sneakers at Sneaker Trader', () => {
  it('Successfully purchase a pair of sneakers', () => {
    render(
      <BrowserRouter>
        <MockListedSneakerRoutesProvider>
          <MockMarketPlaceProvider>
            <HomeLayout />
          </MockMarketPlaceProvider>
        </MockListedSneakerRoutesProvider>
      </BrowserRouter>
    );
    // view the sneaker at the gallery in the market place

    // choose the size at buy sneaker page, go to view sellers page

    // select a seller and confirm purchase

    // PLACE HOLDER
    expect(true).toBe(true);
  });
});
