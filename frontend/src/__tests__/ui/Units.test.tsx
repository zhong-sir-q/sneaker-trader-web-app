import React from 'react';
import { render, screen } from '@testing-library/react';

import Footer from 'components/Footer';

describe('UI unit tests', () => {
  test('Sneaker Trader LTD in the Footer text', () => {
    const footer = render(<Footer default fluid />);
    const copyrightText = footer.getByTestId(/copyright/i).textContent
    const exists = copyrightText && copyrightText.indexOf('Sneaker Trader LTD') !== -1
    expect(exists).toBeTruthy()
  });
});
