import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { Input, InputProps } from 'reactstrap';

const FormikLabelInput = (props: FieldHookConfig<string> & { label: string }) => {
  const [field, meta] = useField(props);

  return (
    <React.Fragment>
      <label>{props.label}</label>
      <Input {...field} {...props as InputProps} />
      {meta.error && <span className='category' style={{ color: 'red', marginLeft: '10px', marginTop: '10px' }}>{meta.error}</span>}
    </React.Fragment>
  );
};

export default FormikLabelInput;
