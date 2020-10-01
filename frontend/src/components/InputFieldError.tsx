import React from 'react';

const InputFieldError = (props: { error: string }) => (
  <div className='category' style={{ color: 'red', marginBottom: '10px' }}>
    {props.error}
  </div>
);

export default InputFieldError;
