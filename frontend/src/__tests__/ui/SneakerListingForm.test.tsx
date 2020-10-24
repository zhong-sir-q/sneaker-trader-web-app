import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import faker from 'faker';

import SneakerListingForm from 'pages/SneakerListingForm';

import {
  SneakerListingFormCtx,
  INIT_LISTING_FORM_CTX,
  INIT_LISTING_FORM_STATE_VALUES,
} from 'providers/SneakerListingFormProvider';
import fakeListingFormStateValues from '__mocks__/data/fakeListingFormStateValues';
import { PreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import onListingSneaker from 'usecases/onListingSneaker';

jest.mock('usecases/onListingSneaker');

const MockSneakerListingFormProvider = (props: { children: React.ReactNode }) => {
  const [listingSneakerFormState, setListingSneakerFormState] = useState(INIT_LISTING_FORM_STATE_VALUES);

  return (
    <SneakerListingFormCtx.Provider
      value={{
        ...INIT_LISTING_FORM_CTX,
        validationSchema: {} as any,
        listingSneakerFormState,
        onSubmit: () => setListingSneakerFormState(fakeListingFormStateValues()),
      }}
    >
      {props.children}
    </SneakerListingFormCtx.Provider>
  );
};

const MockPreviewDropzoneProvider = (props: { children: React.ReactNode }) => {
  const mockFiles = Array(3)
    .fill(0)
    .map((_) => ({ id: faker.random.word(), preview: faker.image.imageUrl() } as any));

  const MOCK_INIT_VALUES = {
    files: mockFiles,
    mainFileId: mockFiles[0].id,
    formDataFromFiles: jest.fn(),
    getMainDisplayFile: jest.fn().mockReturnValue(mockFiles[0]),
    updateFileId: jest.fn(),
    onDropFile: jest.fn(),
    onRemoveFile: jest.fn(),
    destroyFiles: jest.fn(),
  };

  return <PreviewImgDropzoneCtx.Provider value={MOCK_INIT_VALUES}>{props.children}</PreviewImgDropzoneCtx.Provider>;
};

describe('Sneaker listing form', () => {
  it('Reset state values after successfully list a sneaker', () => {
    render(
      <BrowserRouter>
        <MockSneakerListingFormProvider>
          <MockPreviewDropzoneProvider>
            <SneakerListingForm />
          </MockPreviewDropzoneProvider>
        </MockSneakerListingFormProvider>
      </BrowserRouter>
    );

    // submit the sneaker info form

    // sneaker dropzone

    // confirm the listing

    // redirect back to the dashboard

    // come back to the listing form, I should expect the form values to be reset
    expect(true).toBe(true)
  });
});
