import React from 'react';

import SignupForm from 'pages/SignUp';

import { render, fireEvent, screen, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import onSignup from 'usecases/onSignup';

import { BrowserRouter } from 'react-router-dom';

jest.mock('usecases/onSignup');

it('Trigger onSignup function when submitting the form', async () => {
  const signupForm = render(
    <BrowserRouter>
      <SignupForm />
    </BrowserRouter>
  );

  const submitButton = signupForm.getByTestId('signup-submit')

  await wait(() => {
    fireEvent.click(submitButton);
  });

  // nothing has been input yet, so expect the error message

  // TODO: search for what the best way to input a multi-field form
  // in a test
  expect(screen.getByText('Please select a gender')).not.toBeNull()
  expect(onSignup).toBeCalledTimes(0);
});
