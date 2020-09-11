import React from 'react';

const InputFieldError = (props: { error: string }) => (
  <div className='card-category category' style={{ color: 'red', marginLeft: '5px', marginBottom: '10px' }}>
    {props.error}
  </div>
);

export default InputFieldError;
