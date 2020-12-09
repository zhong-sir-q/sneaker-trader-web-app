import React, { useState } from 'react';
import CreditCardPayment from 'react-credit-cards';

import styled from 'styled-components';

import 'react-credit-cards/lib/styles.scss';

const CreditCardPaymentForm = () => {
  const [state, setState] = useState({
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  });

  const handleInputFocus = (e: any) => {
    setState({ ...state, focus: e.target.name });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setState({ ...state, [name]: value });
  };

  return (
    <FormWrapper id='PaymentForm'>
      <CardWrapper>
        <CreditCardPayment
          cvc={state.cvc}
          expiry={state.expiry}
          focused={state.focus as any}
          name={state.name}
          number={state.number}
        />
      </CardWrapper>

      <form>
        <StyledInput name='number' placeholder='Card Number' onChange={handleInputChange} onFocus={handleInputFocus} />
        <StyledInput name='name' placeholder='Full Name' onChange={handleInputChange} onFocus={handleInputFocus} />
        <InputWrapper>
          <div style={{ width: '60%', marginRight: '.5rem' }}>
            <StyledInput
              name='expiry'
              placeholder='Valid Thru'
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <StyledInput
            name='cvc'
            placeholder='CVC'
            width='40%'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </InputWrapper>
      </form>
    </FormWrapper>
  );
};

type StyledInputProps = {
  width?: string;
};

const StyledInput = styled.input<StyledInputProps>`
  border: 2.5px solid gray;
  border-radius: 6px;
  margin-bottom: 8px;
  width: ${({ width }) => width || '100%'};
  height: 2.5rem;

  :focus {
    outline: none;
  }
`;

const FormWrapper = styled.div`
  display: flex;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
  }
`;

const InputWrapper = styled.div`
  display: flex;
`;

const CardWrapper = styled.div`
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

export default CreditCardPaymentForm;
