import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { Input, InputProps, Label } from 'reactstrap';

const FormikLabelInput = (props: FieldHookConfig<string> & { label: string }) => {
  const [field, meta] = useField(props);

  return (
    <React.Fragment>
      <Label>{props.label}</Label>
      <Input {...field} {...props as InputProps} />
      {meta.touched && meta.error && <span className='category' style={{ color: 'red', marginLeft: '10px', marginTop: '10px' }}>{meta.error}</span>}
    </React.Fragment>
  );
};

export default FormikLabelInput;

