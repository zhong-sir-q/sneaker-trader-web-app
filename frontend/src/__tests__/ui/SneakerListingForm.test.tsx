import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Link } from 'react-router-dom';

import { render, screen, fireEvent, wait } from '@testing-library/react';
import faker from 'faker';

import * as Yup from 'yup';

import SneakerListingForm from 'pages/SneakerListingForm';

import {
  SneakerListingFormCtx,
  INIT_LISTING_FORM_CTX,
  INIT_LISTING_FORM_STATE_VALUES,
  SneakerListingFormStateType,
} from 'providers/SneakerListingFormProvider';
import fakeListingFormStateValues from '__mocks__/data/fakeListingFormStateValues';
import { PreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import { ADMIN, DASHBOARD, PRODUCT_LISTING } from 'routes';
import { AuthContext } from 'providers/AuthProvider';
import fakeUser from '__mocks__/data/fakeUser';

import onListingSneaker from 'usecases/onListingSneaker';

jest.mock('usecases/onListingSneaker', () => jest.fn(() => () => {}));

const MockSneakerListingFormProvider = (props: { children: React.ReactNode }) => {
  const [listingSneakerFormState, setListingSneakerFormState] = useState(INIT_LISTING_FORM_STATE_VALUES);

  return (
    <SneakerListingFormCtx.Provider
      value={{
        ...INIT_LISTING_FORM_CTX,
        validationSchema: Yup.object().shape({}),
        listingSneakerFormState,
        onSubmit: (_formValues: SneakerListingFormStateType) =>
          setListingSneakerFormState(fakeListingFormStateValues()),
      }}
    >
      {props.children}
    </SneakerListingFormCtx.Provider>
  );
};

const NUM_MOCK_PREVIEW_FILES = 3;

const mockFiles = Array(NUM_MOCK_PREVIEW_FILES)
  .fill(0)
  .map((_) => ({ id: faker.random.word(), preview: faker.image.imageUrl() } as any));

const MOCK_INIT_PREVIEW_DROPZONE_VALUES = {
  files: mockFiles,
  mainFileId: mockFiles[0].id,
  cropperImage: undefined,
  onConfirmAddCroppedImg: jest.fn(),
  formDataFromFiles: jest.fn(),
  getMainDisplayFile: jest.fn().mockReturnValue(mockFiles[0]),
  updateFileId: jest.fn(),
  onDropFile: jest.fn(),
  onRemoveFile: jest.fn(),
  destroyFiles: jest.fn(),
};

const MockPreviewDropzoneProvider = (props: { children: React.ReactNode }) => {
  return (
    <PreviewImgDropzoneCtx.Provider value={MOCK_INIT_PREVIEW_DROPZONE_VALUES}>
      {props.children}
    </PreviewImgDropzoneCtx.Provider>
  );
};

const MockAuthProvider = (props: { children: React.ReactNode }) => {
  const MOCK_INIT_AUTH_VALUES = { signedIn: true, currentUser: fakeUser(), updateCurrentUser: jest.fn() };

  return <AuthContext.Provider value={MOCK_INIT_AUTH_VALUES}>{props.children}</AuthContext.Provider>;
};

// TODO: I need to brainstorm some unit tests to ensure the individual components are working
// and refactor the proivders to __mocks__
describe('Sneaker listing form', () => {
  it('Reset state values after successfully list a sneaker', async () => {
    render(
      <MockAuthProvider>
        <BrowserRouter>
          <Route path={ADMIN + PRODUCT_LISTING}>
            <MockSneakerListingFormProvider>
              <MockPreviewDropzoneProvider>
                <SneakerListingForm />
              </MockPreviewDropzoneProvider>
            </MockSneakerListingFormProvider>
          </Route>

          <Route path={ADMIN + DASHBOARD}>
            {/* stimulating the sidebar */}
            <Link to={ADMIN + PRODUCT_LISTING} data-testid='sneaker-listing-link'>
              List a sneaker
            </Link>
          </Route>

          <Redirect to={ADMIN + PRODUCT_LISTING} />
        </BrowserRouter>
      </MockAuthProvider>
    );

    // submit the sneaker info form
    // no validation and fake listing form values are used for submission
    const inforFormSubmitButton = screen.getByTestId('sneaker-info-form-submit-btn');

    await wait(() => {
      fireEvent.click(inforFormSubmitButton);
    });

    // sneaker dropzone
    const previewAside = screen.getByTestId('preview-img-container');
    expect(previewAside.childElementCount).toBe(NUM_MOCK_PREVIEW_FILES);

    const confirmPreviewBtn = screen.getByTestId('dropzone-confirm-preview-btn');

    // wrap it inside wait because Formik is doing state updates
    await wait(() => {
      fireEvent.click(confirmPreviewBtn);
    });

    const previewSneakerCardHeader = screen.getByTestId('preview-sneaker-card-header');
    // it should have the name of the sneaker as the title
    expect(previewSneakerCardHeader.textContent === 'Preview of ').toBeFalsy();

    // the card body should render the sneaker card component, a better thing to
    // do is to explicity check that the child is SneakerCard
    const previewSneakerCardBody = screen.getByTestId('preview-sneaker-card-body');
    expect(previewSneakerCardBody.childElementCount).toBe(1);

    // confirm the listing
    const confirmListingButton = screen.getByText('Confirm');

    await wait(() => {
      fireEvent.click(confirmListingButton);
    });

    expect(onListingSneaker).toBeCalledTimes(1);

    // the listing success message shows up
    // redirect back to the dashboard
    const backToDashBoardFromListingSuccess = screen.getByTestId('listing-success-to-dashboard-link');

    fireEvent.click(backToDashBoardFromListingSuccess);

    // come back to the listing form, I should expect the form values to be reset
    const redirectListingFormLink = screen.getByTestId('sneaker-listing-link');
    fireEvent.click(redirectListingFormLink);

    // now inside the sneaker info form
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    expect(nameInput.value).toBe('');

    const brandInput = screen.getByTestId('name-input') as HTMLInputElement;
    expect(brandInput.value).toBe('');

    const colorwayInput = screen.getByTestId('name-input') as HTMLInputElement;
    expect(colorwayInput.value).toBe('');
  });
});
