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

// currently it can only use the data-testid as the attribute key
const typeInputFields = (payload: { [attrKey: string]: string }) =>
  Object.keys(payload).forEach((attrKey) => cy.get(customAttribute(attrKey)).type(payload[attrKey]));

// add type to k overtime, default to data-testid
const customAttribute = (v: string, k: 'data-testid' | 'id' = 'data-testid') => `[${k}="${v}"]`;

const login = () => {
  typeInputFields(testAccount);
  cy.get(customAttribute('signin-btn')).click();
};

const fillSneakerListingForm = () => {
  typeInputFields(listingSneakerInfo);
  cy.get(customAttribute('sneaker-prodCondition', 'id')).select('New')
};

describe('Whole app mono test', () => {
  it('validates listing a pair of sneakers', () => {
    cy.visit('/admin/signin');

    login();

    cy.get(customAttribute('homebar-dashboard-link')).click();
    cy.contains('Product Listing').click();

    fillSneakerListingForm()
    cy.contains('Next').click()

    // NOTE: can only upload one image for for now, multiple files will result in duplicate file uploads
    // the old file gets uploaded too even after removing it using the ui
    cy.get(customAttribute('preview-img-dropzone')).attachFile('harden-vol-3.jpeg')
    cy.contains('Preview').click()

    // cy.contains('Confirm').click()

    // confirm button should be disabled and the screen is in loading animation
  });

  it('tests the buying experience', () => {
    // cy.visit('/')
    // // go to buy sneaker page
    // const sneakerCardName = 'Jordan 4 Columbia White';
    // cy.contains(sneakerCardName).click();
    // const sneakerSize = 'US 9';
    // cy.contains(sneakerSize).click();
    // cy.contains('Buy').click();
    // // redirect to sign in because I am unauthenticated
    // login();
    // redirect to the view seller list page
  });
});
