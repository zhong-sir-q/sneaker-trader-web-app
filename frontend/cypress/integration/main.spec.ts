// TODO: populate dummy sneakers to setup

// TODO: put these data in mocks folder
const testAccount = { 'email-input': 'alex.zhong@sneakertrader.com', 'password-input': '12345678' };

// use default size system "US", currency code "NZD"
const listingSneakerInfo = {
  'name-input': 'KD Elite 9',
  'brand-input': 'Anta',
  'colorway-input': 'White and gold',
  'size-input': '12',
  'price-input': '400',
  'asking-price-input': '550',
};

// add type to k overtime, default to data-testid
const customAttribute = (v: string, k: 'data-testid' | 'id' = 'data-testid') => `[${k}="${v}"]`;

// currently it can only use the data-testid as the attribute key
const typeInputFields = (payload: { [attrKey: string]: string }) => {
  Object.keys(payload).forEach((attrKey) => {
    cy.get(customAttribute(attrKey)).type(payload[attrKey]);
  });
};

const login = () => {
  typeInputFields(testAccount);
  cy.get(customAttribute('signin-btn')).click();
};

const fillSneakerListingForm = () => {
  typeInputFields(listingSneakerInfo);
  cy.get(customAttribute('sneaker-prodCondition', 'id')).select('New');
};

describe('Whole app mono test', () => {
  it('validates listing a pair of sneakers', () => {
    cy.visit('/admin/signin');

    login();

    cy.get(customAttribute('homebar-dashboard-link')).click();
    cy.contains('Product Listing').click();

    cy.get(customAttribute('listing-form-search-bar')).type('Nike 14 Kobe Black');

    fillSneakerListingForm();
    cy.contains('Next').click();

    cy.get(customAttribute('preview-img-dropzone')).attachFile('harden-vol-3.jpeg');
    cy.contains('Confirm').click();
    cy.get(customAttribute('preview-img-dropzone')).attachFile('17-black-white.jpg');
    cy.contains('Confirm').click();
    // remove the 17-black-white sneaker, 0 index based
    cy.get(customAttribute('del-preview-1')).click();
    cy.contains('Preview').click();

    // cy.contains('Confirm').click()
    // // going to loading motion
    // cy.contains('Confirm').should('not.exist')

    // cy.contains('Back to dashboard').click()
    // cy.get(customAttribute('admin-navbar-logout')).click()
  });

  it('tests the buying experience', () => {
    cy.visit('/');

    // go to buy sneaker page
    const sneakerCardName = 'Formposite 1 Gold';
    cy.contains(sneakerCardName).click();
    const sneakerSize = 'US 9';
    cy.contains(sneakerSize).click();
    cy.contains('Buy').click();

    // redirect to sign in because I am unauthenticated
    login();

    expect(
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/Formposite-1-Gold/9');
      })
    );

    // redirect to the view seller list page
  });
});
