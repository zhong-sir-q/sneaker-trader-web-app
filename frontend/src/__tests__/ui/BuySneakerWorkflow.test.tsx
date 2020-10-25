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
        updateFilterSneakers: jest.fn(() => {}),
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
    render(
      <BrowserRouter>
        <MockListedSneakerRoutesProvider>
          <MockMarketPlaceProvider>
            <HomeLayout />
          </MockMarketPlaceProvider>
        </MockListedSneakerRoutesProvider>
      </BrowserRouter>
    );

    // view the sneaker at the gallery in the marketplace
    const randIdx = faker.random.number(NUM_MARKET_PLACE_SNEAKERS - 1);
    const sneakerName = mockGallerySneakers[randIdx].name;
    const sneakerColorway = mockGallerySneakers[randIdx].colorway;

    const sneakerCardElement = screen.getByTestId(`${sneakerName} ${sneakerColorway}`);
    expect(sneakerCardElement.childElementCount).toBe(2);

    // click the card to go to the BuySneaker page
    fireEvent.click(sneakerCardElement);

    // choose the size at buy sneaker page, go to view sellers page
    // 'all' should be the default version for the size
    const buySneakerButton = screen.getByTestId('buy-sneaker-btn') as HTMLButtonElement;
    expect(buySneakerButton.disabled).toBeFalsy();

    // clicking Buy when 'all' is selected will make the US All option go away

    // If not logged in, then buying should redirect the user to the login page
    // but here since we have provided a mock user, we just need to make sure we have
    // checked whether the user is logged

    // select a seller and confirm purchase

    // PLACE HOLDER
    expect(true).toBe(true);
  });
});
