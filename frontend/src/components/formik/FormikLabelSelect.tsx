import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import { CustomInput, Label, CustomInputProps } from 'reactstrap';

const FormikLabelSelect = (props: FieldHookConfig<string> & { label: string }) => {
  const [field, meta] = useField(props);

  return (
    <React.Fragment>
      <Label>{props.label}</Label>
      <CustomInput {...field} {...props as CustomInputProps} type='select'>
        {props.children}
      </CustomInput>
      {meta.touched && meta.error && <span className='category' style={{ color: 'red', marginLeft: '10px', marginTop: '10px' }}>{meta.error}</span>}
    </React.Fragment>
  );
};

export default FormikLabelSelect;

