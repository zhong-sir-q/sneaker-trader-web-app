import React, { useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import { Formik, Form as FormikForm, Field, ErrorMessage, FormikState } from 'formik';

import * as Yup from 'yup';

// reactstrap components
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Container, Row, Col, FormGroup, Label, Button, CardText } from 'reactstrap';

import bgImage from 'assets/img/bg16.jpg';

import { User } from '../../../shared';
import { API_BASE_URL, SIGNIN, AUTH } from 'routes';

import { maxCharacters, required, validEmail, minCharacters, matchingPassword, validDate, customRequired } from 'utils/yup';
import FormikInput from 'components/formik/FormikInput';
import FormikDatetime from 'components/formik/FormikDatetime';

// TODO: This component can be refactored
const SideContent = () => (
  <Col lg={5} md={8} xs={12}>
    <div className='info-area info-horizontal mt-5'>
      <div className='icon icon-primary'>
        <i className='now-ui-icons media-2_sound-wave' />
      </div>
      <div className='description'>
        <h5 className='info-title'>Marketing</h5>
        <p className='description'>We've created the marketing campaign of the website. It was a very interesting collaboration.</p>
      </div>
    </div>
    <div className='info-area info-horizontal'>
      <div className='icon icon-primary'>
        <i className='now-ui-icons media-1_button-pause' />
      </div>
      <div className='description'>
        <h5 className='info-title'>Fully Coded in React 16</h5>
        <p className='description'>
          We've developed the website with React 16, HTML5 and CSS3. The client has access to the code using GitHub.
        </p>
      </div>
    </div>
    <div className='info-area info-horizontal'>
      <div className='icon icon-info'>
        <i className='now-ui-icons users_single-02' />
      </div>
      <div className='description'>
        <h5 className='info-title'>Built Audience</h5>
        <p className='description'>There is also a Fully Customizable CMS Admin Dashboard for this product.</p>
      </div>
    </div>
  </Col>
);

// Create the user in the database
const createDbUser = (user: User) => {
  const endpoint = API_BASE_URL + 'user';
  const fetchOptions: RequestInit = {
    method: 'POST',
    // the backend gets the body using the user key
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(endpoint, fetchOptions)
    .then((res) => res.json())
    .then((resJson) => resJson.user)
    .catch((err) => console.log('Error creating the user in the database', err));
};

type FormStateType = User & { password: string; confirmPassword: string; policyAgreed: string };

// Typescript does not throw an error when using FormStateType instead of User
// so I have to manually transform the form values to a User object
const convertFormValuesToUser = (formValues: FormStateType): User => {
  const { firstName, lastName, userName, gender, dob, email } = formValues;

  return { firstName, lastName, userName, gender, dob, email };
};

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
  firstName: maxCharacters(20),
  lastName: maxCharacters(20),
  userName: maxCharacters(20),
  gender: required(),
  email: validEmail(),
  password: minCharacters(8),
  confirmPassword: matchingPassword('password'),
  dob: validDate(),
  // FIXME: this does not work
  policyAgreed: customRequired('Please read and agree with the terms and conditions'),
});

// TODO: discussion, poor UX asking them to fill out so many fields upon sign up.
// Somehow break up the steps?
const SignupForm = () => {
  const [confirmSignUpAlert, setConfirmSignUpAlert] = useState<JSX.Element>();
  const hideAlert = () => setConfirmSignUpAlert(undefined);
  const showAlert = (alert: JSX.Element) => setConfirmSignUpAlert(alert);

  // TODO: refactor the handleSubmit method, maybe there is too much going on here
  const handleSubmit = async (formStates: FormStateType) => {
    const cognitoUser = await Auth.signUp({ username: formStates.email, password: formStates.password })
      .then((res) => res.user)
      .catch((err) => err);

    if (cognitoUser.message) {
      const ErrorSignUpAlert = () => (
        <SweetAlert
          style={{ display: 'block', marginTop: '-100px' }}
          title={cognitoUser.message}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle='danger'
        />
      );

      showAlert(<ErrorSignUpAlert />);
      return;
    }

    const ConfirmSignUpAlert = () => (
      <SweetAlert
        style={{ display: 'block', marginTop: '-100px' }}
        title='Please check your email to verify the account'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='info'
      />
    );

    showAlert(<ConfirmSignUpAlert />);

    const dbUser = await createDbUser(convertFormValuesToUser(formStates));
    // TODO: discuss with Aaron how we want to handle this error
    // handle create user error in the database
    if (!dbUser) console.log('Do something with the error')
  };

  return (
    <React.Fragment>
      <div className='content'>
        {confirmSignUpAlert}
        <div className='register-page'>
          <Container>
            <Row className='justify-content-center'>
              <SideContent />
              <Col lg={4} md={8} xs={12}>
                <Formik
                  initialValues={INIT_FORM_VALUES}
                  validationSchema={validationSchema}
                  onSubmit={(formStates, { setSubmitting, resetForm }) => {
                    setTimeout(async () => {
                      handleSubmit(formStates);
                      resetForm(INIT_FORM_VALUES as Partial<FormikState<FormStateType>>);
                      setSubmitting(false);
                    }, 400);
                  }}
                >
                  <Card className='card-signup'>
                    <FormikForm>
                      <CardHeader className='text-center'>
                        <CardTitle tag='h4'>Register</CardTitle>
                        <CardText>
                          <Link to={AUTH + SIGNIN}>Already have an account?</Link>
                        </CardText>
                      </CardHeader>
                      <CardBody>
                        <FormikInput name='firstName' placeholder='First Name...' type='text' iconname='users_circle-08' />
                        <FormikInput name='lastName' placeholder='Last Name...' type='text' iconname='text_caps-small' />

                        {/* FIXME: the text margin is off; not enough right padding on the arrow; how do I gray the color the place holder */}
                        <FormikInput style={{ paddingLeft: '12px' }} name='gender' type='select' iconname='users_single-02'>
                          <option disabled value=''>
                            Select a gender
                          </option>
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                          <option value='confidential'>Prefer not to say</option>
                        </FormikInput>

                        <FormikInput name='userName' placeholder='User Name...' type='text' iconname='emoticons_satisfied' />
                        <FormikInput name='email' placeholder='Email...' type='email' iconname='ui-1_email-85' />
                        <FormikInput name='password' placeholder='Password...' type='password' iconname='ui-1_lock-circle-open' />
                        <FormikInput
                          name='confirmPassword'
                          placeholder='Confirm Password...'
                          type='password'
                          iconname='ui-1_lock-circle-open'
                        />

                        {/* FIXME: resetForm in onSubmit does not reset the datevalue */}
                        <Field name='dob' timeFormat={false} placeholder='Date Of Birth...' component={FormikDatetime} />

                        {/* TODO: check if the terms and condition is checked */}
                        <FormGroup check>
                          <Label check>
                            <Field name='policyAgreed' type='checkbox' />
                            <span className='form-check-sign' />
                            <div>
                              I agree to the <a href='#policy'>terms and conditions</a>.
                            </div>
                            <ErrorMessage name='policyAgreed' />
                          </Label>
                        </FormGroup>
                      </CardBody>

                      <CardFooter className='text-center'>
                        <Button type='submit' color='primary' size='lg' className='btn-round'>
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
      <div className='full-page-background' style={{ backgroundImage: `url(${bgImage})` }} />
    </React.Fragment>
  );
};

export default SignupForm;
