import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { Input, InputProps, Label } from 'reactstrap';
import InputFieldError from 'components/InputFieldError';

const FormikLabelInput = (props: FieldHookConfig<string> & { label: string }) => {
  const [field, meta] = useField(props);

  return (
    <React.Fragment>
      <Label>{props.label}</Label>
      <Input {...field} {...props as InputProps} />
      {meta.touched && meta.error && <InputFieldError error={meta.error} />}
    </React.Fragment>
  );
};

export default FormikLabelInput;

