import React, { useState } from 'react';

import { mount } from 'cypress-react-unit-test';

const Hello = () => {
  const [val, setVal] = useState('Hello');

  const toggleVal = () => setVal(val === 'Hello' ? 'Ni Hao' : 'Hello');

  return (
    <div>
      <p>{val}</p>
      <button onClick={toggleVal}>Toggle</button>
    </div>
  );
};

describe('Hello', () => {
  it('Toggle hello component value', () => {
    mount(<Hello />);

    cy.contains('Hello');

    cy.contains('Toggle').click()

    cy.contains('Ni Hao')
  });
});
