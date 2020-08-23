import Datetime from 'react-datetime';
import SweetAlert from 'react-bootstrap-sweetalert';
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import moment, { Moment } from 'moment';
import { Formik, Form as FormikForm, useField, FieldHookConfig, Field, ErrorMessage, FormikState } from 'formik';
import * as Yup from 'yup';

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
  InputProps,
} from 'reactstrap';

import bgImage from 'assets/img/bg16.jpg';

import { User } from '../../../shared';
import { API_BASE_URL } from 'routes';

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

export const FieldError = (props: { error: string }) => (
  <div className="card-category category" style={{ color: 'red', marginLeft: '5px', marginBottom: '10px' }}>
    {props.error}
  </div>
);

// TODO:put this in a specific folder
export const FormikInput = (props: FieldHookConfig<string> & { iconname: string, inputgroupclassname?: string }) => {
  const [field, meta] = useField(props);
  const [focus, setFocus] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);
    setFocus(false);
  };

  // NOTE: the space here is neccessary, assuming the
  // user inputs the classname value without the space
  const inputgroupclassname = props.inputgroupclassname ? props.inputgroupclassname + ' ' : ''

  return (
    <React.Fragment>
      <InputGroup className={inputgroupclassname + (focus ? 'input-group-focus' : '')}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className={'now-ui-icons ' + props.iconname} />
          </InputGroupText>
        </InputGroupAddon>
        <Input {...field} {...props as InputProps} onFocus={() => setFocus(true)} onBlur={handleBlur}>
          {props.children}
        </Input>
      </InputGroup>
      {meta.touched && meta.error && <FieldError error={meta.error} />}
    </React.Fragment>
  );
};

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
      {form.touched[field.name] && form.errors[field.name] && <FieldError error={form.errors[field.name]} />}
    </React.Fragment>
  );
};

// Create the user in the database
const createDbUser = (user: User) => {
  const endpoint = API_BASE_URL + 'user';
  const fetchOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(endpoint, fetchOptions)
    .then((res) => res.json())
    .then((resJson) => resJson.user)
    .catch((err) => err);
};

// Sign up the user in Cognito using Amplfiy
const cognitoSignUp = (email: string, pw: string) =>
  Auth.signUp({ username: email, password: pw })
    .then((res) => res.user)
    .catch((err) => err);

const REQUIRED = '* Required';

type FormStateType = User & { password: string; confirmPassword: string; policyAgreed: string };

const INIT_FORM_VALUES: FormStateType = {
  firstName: '',
  lastName: '',
  userName: '',
  gender: '',
  email: '',
  password: '',
  confirmPassword: '',
  dob: '',
  policyAgreed: '',
};

// TODO: refactor and put this in a specific folder
const validationSchema = Yup.object({
  firstName: Yup.string().max(20, 'Must be 20 characters or less').required(REQUIRED),
  lastName: Yup.string().max(20, 'Must be 20 characters or less').required(REQUIRED),
  userName: Yup.string().max(20, 'Must be 20 characters or less').required(REQUIRED),
  gender: Yup.string().required(REQUIRED),
  email: Yup.string().email('Invalid email address').required(REQUIRED),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required(REQUIRED),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Password must match')
    .required(REQUIRED),
  dob: Yup.string()
    .required(REQUIRED)
    .test('valid-date', 'Invalid date format', (datevalue) => moment(datevalue, DATE_FORMAT, true).isValid()),
  // FIXME: this does not work
  policyAgreed: Yup.string().required('Please read and agree with the terms and conditions'),
});

const SignupForm = () => {
  const [confirmSignUpAlert, setConfirmSignUpAlert] = useState<JSX.Element>();
  const hideAlert = () => setConfirmSignUpAlert(undefined);
  const showAlert = (alert: JSX.Element) => setConfirmSignUpAlert(alert);

  const handleSubmit = async (formStates: FormStateType) => {
    const cognitoUser = await cognitoSignUp(formStates.email, formStates.password);

    if (cognitoUser instanceof Error) {
      const ErrorSignUpAlert = () => (
        <SweetAlert
          style={{ display: 'block', marginTop: '-100px' }}
          title={cognitoUser.message}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="danger"
        />
      );

      showAlert(<ErrorSignUpAlert />);
      return;
    }

    // WARNING: the states contains fields such as password that is not part of the database
    // ideally I would want the complier to complain the incompatibility here

    // how do I want to handle it if there is an error creating the user in the database?
    const dbUser = await createDbUser(formStates);
    if (dbUser instanceof Error) console.log('Handle error', dbUser.message);

    // create the db user here
    const ConfirmSignUpAlert = () => (
      <SweetAlert
        style={{ display: 'block', marginTop: '-100px' }}
        title="Please check your email to verify the account"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
      />
    );

    showAlert(<ConfirmSignUpAlert />);
  };

  return (
    <React.Fragment>
      <div className="content">
        {confirmSignUpAlert}
        <div className="register-page">
          <Container>
            <Row className="justify-content-center">
              <SideContent />
              <Col lg={4} md={8} xs={12}>
                <Formik
                  initialValues={INIT_FORM_VALUES}
                  validationSchema={validationSchema}
                  onSubmit={(formStates, { setSubmitting, resetForm }) => {
                    setTimeout(async () => {
                      handleSubmit(formStates)
                      resetForm(INIT_FORM_VALUES as Partial<FormikState<FormStateType>>);
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
                        <FormikInput name="firstName" placeholder="First Name..." type="text" iconname="users_circle-08" />
                        <FormikInput name="lastName" placeholder="Last Name..." type="text" iconname="text_caps-small" />

                        {/* FIXME: the text margin is off; not enough right padding on the arrow; how do I gray the color the place holder */}
                        <FormikInput style={{ paddingLeft: '12px' }} name="gender" type="select" iconname="users_single-02">
                          <option disabled value="">
                            Select a gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="confidential">Prefer not to say</option>
                        </FormikInput>

                        <FormikInput name="userName" placeholder="User Name..." type="text" iconname="emoticons_satisfied" />
                        <FormikInput name="email" placeholder="Email..." type="email" iconname="ui-1_email-85" />
                        <FormikInput name="password" placeholder="Password..." type="password" iconname="ui-1_lock-circle-open" />
                        <FormikInput
                          name="confirmPassword"
                          placeholder="Confirm Password..."
                          type="password"
                          iconname="ui-1_lock-circle-open"
                        />

                        {/* FIXME: resetForm in onSubmit does not reset the datevalue */}
                        <Field name="dob" timeFormat={false} placeholder="Date Of Birth..." component={FormikDatetime} />

                        {/* TODO: check if the terms and condition is checked */}
                        <FormGroup check>
                          <Label check>
                            <Field name="policyAgreed" type="checkbox" />
                            <span className="form-check-sign" />
                            <div>
                              I agree to the <a href="#policy">terms and conditions</a>.
                            </div>
                            <ErrorMessage name="policyAgreed" />
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
