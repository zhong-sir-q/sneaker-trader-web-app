import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Formik, Form as FormikForm, Field, ErrorMessage, FormikState } from 'formik';

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
  Label,
  Button,
  CardText,
} from 'reactstrap';

import styled from 'styled-components';

import FormikInput from 'components/formik/FormikInput';
import FormikDatetime from 'components/formik/FormikDatetime';

import {
  maxCharacters,
  validEmail,
  minCharacters,
  matchingPassword,
  validDate,
  validPhoneNo,
  checkDuplicateUsername,
  customRequired,
} from 'utils/yup';

import { SIGNIN, AUTH, PRIVACY_POLICY } from 'routes';
import { CreateUserPayload } from '../../../shared';

import bgImage from 'assets/img/bg16.jpg';
import onSignup from 'usecases/onSignup';

import UserRegistrationControllerInstance from 'api/controllers/UserRegistrationController';

type SignupFormStateType = CreateUserPayload & { password: string; confirmPassword: string; policyAgreed: boolean };

const RedStyledComp = styled.div`
  color: red;
`;

// omit policyAgreed, password and confirmPasswordField
const convertFormValuesToUser = (formValues: SignupFormStateType): CreateUserPayload => {
  const { firstName, lastName, username, gender, dob, email, phoneNo } = formValues;

  return { firstName, lastName, username, gender, dob, email, phoneNo, signinMethod: 'email' };
};

const INIT_FORM_VALUES: SignupFormStateType = {
  firstName: '',
  lastName: '',
  username: '',
  gender: '',
  email: '',
  password: '',
  phoneNo: '',
  confirmPassword: '',
  dob: '',
  policyAgreed: false,
  signinMethod: 'email',
};

const validationSchema = Yup.object({
  firstName: maxCharacters(20),
  lastName: maxCharacters(20),
  username: checkDuplicateUsername(),
  gender: customRequired('Please select a gender'),
  email: validEmail(),
  phoneNo: validPhoneNo(),
  password: minCharacters(8),
  confirmPassword: matchingPassword('password'),
  dob: validDate('MM/DD/YYYY'),
  // FIXME: this does not work
  policyAgreed: Yup.boolean().oneOf([true], 'Please read and accept the privacy policy and terms and conditions'),
});

const SignUpSuccess = () => (
  <React.Fragment>
    <div className='content'>
      <section className='register-page'>
        <Container>
          <Col xs={12} md={8} lg={4} className='ml-auto mr-auto'>
            <Card className='card-lock text-center'>
              <CardHeader data-testid='signup-success-card-header'>
                <CardTitle tag='h5'>Thank you for signing up with SneakerTrader</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>
                  We have sent a account confirmation email, please use that to finish the sign up, xD
                </CardText>
              </CardBody>
              <CardFooter>
                <Button color='primary'>
                  <Link style={{ color: 'white' }} to={AUTH + SIGNIN}>
                    Back to sign in
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Container>
      </section>
    </div>
    <div className='full-page-background' style={{ backgroundImage: `url(${bgImage})` }} />
  </React.Fragment>
);

const SignupForm = () => {
  const [signUpError, setSignUpError] = useState<string>();
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (formStates: SignupFormStateType) => {
    try {
      await onSignup(UserRegistrationControllerInstance)(convertFormValuesToUser(formStates), formStates.password);
      setSignUpSuccess(true);
    } catch (err) {
      setSignUpError(err.message);
    }
  };

  return signUpSuccess ? (
    <SignUpSuccess />
  ) : (
    <React.Fragment>
      <div className='content'>
        <div className='register-page'>
          <Container>
            <Row className='justify-content-center'>
              <Col lg={4} md={8} xs={12}>
                <Formik
                  initialValues={INIT_FORM_VALUES}
                  validationSchema={validationSchema}
                  onSubmit={async (formStates, { setSubmitting, resetForm }) => {
                    await handleSubmit(formStates);
                    resetForm(INIT_FORM_VALUES as Partial<FormikState<SignupFormStateType>>);
                    setSubmitting(false);
                  }}
                >
                  <Card className='card-signup'>
                    <FormikForm>
                      <CardHeader className='text-center'>
                        <CardTitle tag='h4'>Register</CardTitle>
                        <CardText>
                          <Link to={AUTH + SIGNIN}>Already have an account?</Link>
                        </CardText>
                        {signUpError && <CardText style={{ color: 'red' }}>{signUpError}</CardText>}
                      </CardHeader>
                      <CardBody>
                        <FormikInput
                          name='firstName'
                          placeholder='First Name...'
                          type='text'
                          iconname='users_circle-08'
                        />
                        <FormikInput
                          name='lastName'
                          placeholder='Last Name...'
                          type='text'
                          iconname='text_caps-small'
                        />

                        <FormikInput
                          name='username'
                          placeholder='User Name...'
                          type='text'
                          iconname='emoticons_satisfied'
                        />

                        <FormikInput
                          name='phoneNo'
                          placeholder='Phone number...'
                          type='text'
                          iconname='ui-2_chat-round'
                        />

                        <FormikInput name='email' placeholder='Email...' type='email' iconname='ui-1_email-85' />

                        <FormikInput
                          name='password'
                          placeholder='Password...'
                          type='password'
                          iconname='ui-1_lock-circle-open'
                        />

                        <FormikInput
                          name='confirmPassword'
                          placeholder='Confirm Password...'
                          type='password'
                          iconname='ui-1_lock-circle-open'
                        />

                        <FormikInput
                          style={{ paddingLeft: '12px' }}
                          name='gender'
                          type='select'
                          iconname='users_single-02'
                        >
                          <option disabled value=''>
                            Select a gender
                          </option>
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                          <option value='confidential'>Prefer not to say</option>
                        </FormikInput>

                        {/* FIXME: resetForm in onSubmit does not reset the datevalue */}
                        <Field
                          name='dob'
                          timeFormat={false}
                          placeholder='Date Of Birth...'
                          component={FormikDatetime}
                        />

                        <FormGroup check>
                          <Label style={{ marginLeft: '6px' }} check>
                            <Field name='policyAgreed' type='checkbox' />
                            <span className='form-check-sign' />
                            <div>
                              By signing up, I agree to the{' '}
                              <a href={PRIVACY_POLICY} target='_blank' rel='noopener noreferrer'>
                                privacy policy
                              </a>{' '}
                              and <a href='#policy'>terms and conditions</a>.
                            </div>
                            <RedStyledComp>
                              <ErrorMessage name='policyAgreed' />
                            </RedStyledComp>
                          </Label>
                        </FormGroup>
                      </CardBody>

                      <CardFooter className='text-center'>
                        <Button
                          data-testid='signup-submit'
                          type='submit'
                          color='primary'
                          size='lg'
                          className='btn-round'
                        >
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
