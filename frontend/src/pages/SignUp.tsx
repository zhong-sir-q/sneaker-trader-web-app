import Datetime from 'react-datetime';
import React, { useState } from 'react';
import { Formik, Form as FormikForm, useField, FieldHookConfig, Field } from 'formik';
import * as Yup from 'yup';
import { Moment } from 'moment';

// reactstrap components
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Button,
} from 'reactstrap';

import bgImage from 'assets/img/bg16.jpg';
import moment from 'moment';

// TODO: This component can be refactored
const SideContent = () => (
  <Col lg={5} md={8} xs={12}>
    <div className="info-area info-horizontal mt-5">
      <div className="icon icon-primary">
        <i className="now-ui-icons media-2_sound-wave" />
      </div>
      <div className="description">
        <h5 className="info-title">Marketing</h5>
        <p className="description">We've created the marketing campaign of the website. It was a very interesting collaboration.</p>
      </div>
    </div>
    <div className="info-area info-horizontal">
      <div className="icon icon-primary">
        <i className="now-ui-icons media-1_button-pause" />
      </div>
      <div className="description">
        <h5 className="info-title">Fully Coded in React 16</h5>
        <p className="description">
          We've developed the website with React 16, HTML5 and CSS3. The client has access to the code using GitHub.
        </p>
      </div>
    </div>
    <div className="info-area info-horizontal">
      <div className="icon icon-info">
        <i className="now-ui-icons users_single-02" />
      </div>
      <div className="description">
        <h5 className="info-title">Built Audience</h5>
        <p className="description">There is also a Fully Customizable CMS Admin Dashboard for this product.</p>
      </div>
    </div>
  </Col>
);

const FieldError = (props: { error: string }) => (
  <div className="card-category category" style={{ color: 'red', marginLeft: '5px', marginBottom: '10px' }}>
    {props.error}
  </div>
);

const FormikInput = (props: FieldHookConfig<string> & { iconName: string }) => {
  const [field, meta] = useField(props);
  const [focus, setFocus] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);
    setFocus(false);
  };

  return (
    <React.Fragment>
      <InputGroup className={focus ? 'input-group-focus' : ''}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className={'now-ui-icons ' + props.iconName} />
          </InputGroupText>
        </InputGroupAddon>
        <Input {...field} onFocus={() => setFocus(true)} onBlur={handleBlur} placeholder={props.placeholder} type={props.type as any}>
          {props.children}
        </Input>
      </InputGroup>
      {meta.touched && meta.error && <FieldError error={meta.error} />}
    </React.Fragment>
  );
};

const DATE_FORMAT = 'MM/DD/YYYY';

// TODO: give th props the proper types
const FormikDatetime = (props: { field: any; form: any; timeFormat: boolean, placeholder: string }) => {
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
      <Datetime dateFormat={DATE_FORMAT} timeFormat={timeFormat} onChange={onFieldChange} onBlur={onFieldBlur} inputProps={{ placeholder, style: { padding: '10px 18px 10px 18px' }  }} />
      </div>
      {form.touched[field.name] && form.errors[field.name] && <FieldError error={form.errors[field.name]} />}
    </React.Fragment>
  );
};

const REQUIRD = '* Required';

const validationSchema = Yup.object({
  firstName: Yup.string().max(15, 'Must be 15 characters or less').required(REQUIRD),
  lastName: Yup.string().max(20, 'Must be 20 characters or less').required(REQUIRD),
  gender: Yup.string().required(REQUIRD),
  email: Yup.string().email('Invalid email address').required(REQUIRD),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required(REQUIRD),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Password must match')
    .required(REQUIRD),
  dob: Yup.string().required(REQUIRD),
});

const SignupForm = () => {
  return (
    <React.Fragment>
      <div className="content">
        <div className="register-page">
          <Container>
            <Row className="justify-content-center">
              <SideContent />
              <Col lg={4} md={8} xs={12}>
                <Formik
                  initialValues={{ firstName: '', lastName: '', gender: '', email: '', password: '', confirmPassword: '', dob: '' }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      alert(JSON.stringify(values, null, 2));
                      setSubmitting(false);
                    }, 400);
                  }}
                >
                  <Card className="card-signup">
                    <FormikForm>
                      <CardHeader className="text-center">
                        <CardTitle tag="h4">Register</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <FormikInput name="firstName" placeholder="First Name..." type="text" iconName="users_circle-08" />
                        <FormikInput name="lastName" placeholder="Last Name..." type="text" iconName="text_caps-small" />

                        <FormikInput name="gender" type="select" iconName="users_single-02">
                          <option disabled value="">
                            Select a gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="confidential">Prefer not to say</option>
                        </FormikInput>

                        <FormikInput name="email" placeholder="Email..." type="email" iconName="ui-1_email-85" />
                        <FormikInput name="password" placeholder="Password..." type="password" iconName="ui-1_lock-circle-open" />
                        <FormikInput
                          name="confirmPassword"
                          placeholder="Confirm Password..."
                          type="password"
                          iconName="ui-1_lock-circle-open"
                        />

                        <Field name='dob' timeFormat={false} placeholder='Date Of Birth...' component={FormikDatetime} />

                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" />
                            <span className="form-check-sign" />
                            <div>
                              I agree to the <a href="#policy">terms and conditions</a>.
                            </div>
                          </Label>
                        </FormGroup>
                      </CardBody>

                      <CardFooter className="text-center">
                        <Button type="submit" color="primary" size="lg" className="btn-round">
                          Get Started
                        </Button>
                      </CardFooter>
                    </FormikForm>
                  </Card>
                </Formik>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <div className="full-page-background" style={{ backgroundImage: 'url(' + bgImage + ')' }} />
    </React.Fragment>
  );
};

export default SignupForm;
