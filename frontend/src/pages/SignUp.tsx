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

import FormikInput from 'components/formik/FormikInput';
import FormikDatetime from 'components/formik/FormikDatetime';

import {
  maxCharacters,
  required,
  validEmail,
  minCharacters,
  matchingPassword,
  validDate,
  customRequired,
  validPhoneNo,
  checkDuplicateUsername,
} from 'utils/yup';

import { SIGNIN, AUTH } from 'routes';
import { CreateUserPayload } from '../../../shared';

import bgImage from 'assets/img/bg16.jpg';
import onSignup from 'usecases/onSignup';
import UserControllerInstance from 'api/controllers/UserController';
import WalletControllerInstance from 'api/controllers/WalletController';

// TODO: This component can be refactored
const SideContent = () => (
  <Col lg={5} md={8} xs={12}>
    <div className='info-area info-horizontal mt-5'>
      <div className='icon icon-primary'>
        <i className='now-ui-icons media-2_sound-wave' />
      </div>
      <div className='description'>
        <h5 className='info-title'>Marketing</h5>
        <p className='description'>
          We've created the marketing campaign of the website. It was a very interesting collaboration.
        </p>
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

type SignupFormStateType = CreateUserPayload & { password: string; confirmPassword: string; policyAgreed: string };

// Typescript does not throw an error when using SignupFormStateType instead of User
// so I have to manually transform the form values to a User object
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
  policyAgreed: '',
  signinMethod: 'email',
};

const validationSchema = Yup.object({
  firstName: maxCharacters(20),
  lastName: maxCharacters(20),
  username: checkDuplicateUsername(),
  gender: required(),
  email: validEmail(),
  phoneNo: validPhoneNo(),
  password: minCharacters(8),
  confirmPassword: matchingPassword('password'),
  dob: validDate(),
  // FIXME: this does not work
  policyAgreed: customRequired('Please read and agree with the terms and conditions'),
});

const SignUpSuccess = () => (
  <React.Fragment>
    <div className='content'>
      <section className='register-page'>
        <Container>
          <Col xs={12} md={8} lg={4} className='ml-auto mr-auto'>
            <Card className='card-lock text-center'>
              <CardHeader>
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

// TODO: discussion, poor UX asking them to fill out so many fields upon sign up.
// Somehow break up the steps?
const SignupForm = () => {
  const [signUpError, setSignUpError] = useState<string>();
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (formStates: SignupFormStateType) => {
    try {
      await onSignup(UserControllerInstance, WalletControllerInstance)(
        convertFormValuesToUser(formStates),
        formStates.password
      );
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
              <SideContent />
              <Col lg={4} md={8} xs={12}>
                <Formik
                  initialValues={INIT_FORM_VALUES}
                  validationSchema={validationSchema}
                  onSubmit={(formStates, { setSubmitting, resetForm }) => {
                    setTimeout(async () => {
                      handleSubmit(formStates);
                      resetForm(INIT_FORM_VALUES as Partial<FormikState<SignupFormStateType>>);
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

                        {/* FIXME: the text margin is off; not enough right padding on the arrow; how do I gray the color the place holder */}
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
