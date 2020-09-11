import React, { useState } from 'react';
import { FieldHookConfig, useField } from 'formik';
import { InputGroup, InputGroupAddon, InputGroupText, Input, InputProps } from 'reactstrap';
import InputFieldError from 'components/InputFieldError';

// iconname and inputgroupclassname are lowercased because they are not the default html element props
const FormikInput = (props: FieldHookConfig<string> & { iconname: string; inputgroupclassname?: string }) => {
  const [field, meta] = useField(props);
  const [focus, setFocus] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);
    setFocus(false);
  };

  // NOTE: the space here is neccessary, assuming the
  // user inputs the classname prop without the space
  const inputgroupclassname = props.inputgroupclassname ? props.inputgroupclassname + ' ' : '';

  return (
    <React.Fragment>
      <InputGroup className={inputgroupclassname + (focus ? 'input-group-focus' : '')}>
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>
            <i className={'now-ui-icons ' + props.iconname} />
          </InputGroupText>
        </InputGroupAddon>
        <Input {...field} {...(props as InputProps)} onFocus={() => setFocus(true)} onBlur={handleBlur}>
          {props.children}
        </Input>
      </InputGroup>
      {meta.touched && meta.error && <InputFieldError error={meta.error} />}
    </React.Fragment>
  );
};

export default FormikInput;
