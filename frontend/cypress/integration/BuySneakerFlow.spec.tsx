/// <reference types="cypress" />

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render, screen, fireEvent } from '@testing-library/react';

import faker from 'faker';

import HomeLayout from 'layouts/HomeLayout';

import fakeGetListedSneaker from '__mocks__/data/fakeGetListedSneaker';
import fakeGallerySneaker from '__mocks__/data/fakeGallerySneaker';
import fakeUser from '__mocks__/data/fakeUser';

import { AuthContext } from 'providers/AuthProvider';
import { MarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';
import { ListedSneakerRoutesCtx, renderListedSneakerRoutes } from 'providers/ListedSneakerRoutesProvider';

import BuySneakerPageContainer from 'containers/BuySneakerPageContainer';
import mount from 'cypress-react-unit-test/lib';

// CONFUSION: how exactly does React know which BuySneakerPgaeContainer to render?
const MockBuySneakerPageContainer = () => {};

jest.mock('containers/BuySneakerPageContainer');

const NUM_MOCK_LISTED_SNEAKERS = 10;

const MOCK_INIT_LISTED_SNEAKERS = Array(NUM_MOCK_LISTED_SNEAKERS)
  .fill(0)
  .map((_) => fakeGetListedSneaker(faker.random.number(), faker.random.number()));

const MockListedSneakerRoutesProvider = (props: { children: React.ReactNode }) => {
  return (
    <ListedSneakerRoutesCtx.Provider
      value={{ listedSneakerRoutes: renderListedSneakerRoutes(MOCK_INIT_LISTED_SNEAKERS) }}
    >
      {props.children}
    </ListedSneakerRoutesCtx.Provider>
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
        updateFilterSneakers: jest.fn(),
        isFilterSelected: jest.fn(),
        onSelectFilter: jest.fn(),
        filterItemGroup: [],
      }}
    >
      {props.children}
    </MarketPlaceCtx.Provider>
  );
};

// NOTE: this mock auth provider is used in SneakerListingForm
const MockAuthProvider = (props: { children: React.ReactNode }) => {
  const MOCK_INIT_AUTH_VALUES = { signedIn: true, currentUser: fakeUser(), updateCurrentUser: jest.fn() };

  return <AuthContext.Provider value={MOCK_INIT_AUTH_VALUES}>{props.children}</AuthContext.Provider>;
};

describe('Buying a pair of sneakers at Sneaker Trader', () => {
  it('Successfully purchase a pair of sneakers', () => {
    mount(
      <BrowserRouter>
        <MockAuthProvider>
          <MockListedSneakerRoutesProvider>
            <MockMarketPlaceProvider>
              <HomeLayout />
            </MockMarketPlaceProvider>
          </MockListedSneakerRoutesProvider>
        </MockAuthProvider>
      </BrowserRouter>
    );
  });

  const randIdx = faker.random.number(NUM_MARKET_PLACE_SNEAKERS - 1);
  const sneakerName = mockGallerySneakers[randIdx].name;
  const sneakerColorway = mockGallerySneakers[randIdx].colorway;

  const sneakerCardElement = cy.get(`[data-testid="${sneakerName} ${sneakerColorway}"]`);
  sneakerCardElement.should('have.length', 2);
  sneakerCardElement.click();
});
