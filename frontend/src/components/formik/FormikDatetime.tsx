import React from 'react';
import Datetime from 'react-datetime';
import moment, { Moment } from 'moment';
import InputFieldError from 'components/InputFieldError';

const DATE_FORMAT = 'MM/DD/YYYY';
// inherit the field and form from the Formik component
const FormikDatetime = (props: { field: any; form: any; timeFormat: boolean; placeholder: string }) => {
  const { form, field, timeFormat, placeholder } = props;

  const onFieldChange = (value: Moment | string) => {
    // if the date field isn't in a valid date format,
    // react-datetime's onChange handler returns a string
    // otherwise it returns a moment object
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
          value={field.value}
        />
      </div>
      {form.touched[field.name] && form.errors[field.name] && <InputFieldError error={form.errors[field.name]} />}
    </React.Fragment>
  );
};

export default FormikDatetime;
