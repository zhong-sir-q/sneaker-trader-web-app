import React from "react";
import Datetime from 'react-datetime'
import moment, { Moment } from "moment";
import InputFieldError from "components/InputFieldError";

// This is used in Yup, too. can potentially put it in the shared folder
const DATE_FORMAT = 'MM/DD/YYYY';
// TODO: give th props the proper types
const FormikDatetime = (props: { field: any; form: any; timeFormat: boolean; placeholder: string }) => {
  const { form, field, timeFormat, placeholder } = props;

  const onFieldChange = (value: Moment | string) => {
    // if the date field isn't in a valid date format,
    // react-datetime's onChange handler returns a string
    // otherwise it returns a moment object
    // this is why we can't override DateTime's onChange
    // prop with Formik's field.onChange
    const dateValue = typeof value === 'string' ? value : moment(value).format(DATE_FORMAT);

    form.setFieldValue(field.name, dateValue);
  };

  const onFieldBlur = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <React.Fragment>
      <div style={{ marginBottom: '10px' }}>
        <Datetime
          dateFormat={DATE_FORMAT}
          timeFormat={timeFormat}
          onChange={onFieldChange}
          onBlur={onFieldBlur}
          inputProps={{ placeholder, style: { padding: '10px 18px 10px 18px' } }}
        />
      </div>
      {form.touched[field.name] && form.errors[field.name] && <InputFieldError error={form.errors[field.name]} />}
    </React.Fragment>
  );
};

export default FormikDatetime
