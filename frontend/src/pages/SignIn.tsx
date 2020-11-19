import React, { useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Link } from 'react-router-dom';

// reactstrap components
import { Card, CardBody, CardHeader, CardFooter, Container, Col, Button } from 'reactstrap';
import * as Yup from 'yup';

// components
import InputFieldError from 'components/InputFieldError';
import FormikInput from 'components/formik/FormikInput';

import { validEmail, minCharacters } from 'utils/yup';

import { SIGNUP, AUTH, FORGOT_PW, HOME } from 'routes';

import stLogo from 'assets/img/logo_transparent_background.png';
import bgImage from 'assets/img/bg14.jpg';
import { signIn } from 'utils/auth';
import SignInWithGoogle from 'components/buttons/SigninWithGoogle';
import SignInWithFacebook from 'components/buttons/SignInWithFacebook';

type SignInFormStateType = {
  email: string;
  password: string;
};

const INIT_FORM_STATES: SignInFormStateType = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: validEmail(),
  password: minCharacters(8),
});

const SignIn = () => {
  const [loginError, setLoginError] = useState<string>();

  // TODO: handle same username error after social signin
  const updateLoginErr = (message: string) => setLoginError(message);

  const onSignin = async (email: string, pw: string) => {
    try {
      await signIn(email, pw);
    } catch (err) {
      // handling error from aws cognito
      if (err.code === 'NotAuthorizedException') setLoginError('Incorrect email or password');
      else updateLoginErr(err.message);
    }
  };

  return (
    <React.Fragment>
      <div className='content'>
        <div className='login-page'>
          <Container>
            <Col xs={12} md={8} lg={4} className='ml-auto mr-auto'>
              <Formik
                initialValues={INIT_FORM_STATES}
                validationSchema={validationSchema}
                onSubmit={async (formStates) => await onSignin(formStates.email, formStates.password)}
              >
                <FormikForm>
                  <Card className='card-login card-plain'>
                    <CardHeader>
                      <div className='logo-container' style={{ width: '120px', marginBottom: '35px' }}>
                        <Link to={HOME}>
                          <img src={stLogo} alt='sneakertrader-logo' />
                        </Link>
                      </div>
                      <SignInWithGoogle handleSignin={updateLoginErr} />
                      <SignInWithFacebook handleSignin={updateLoginErr} />
                    </CardHeader>
                    <CardBody>
                      {loginError && <InputFieldError error={loginError} />}

                      <FormikInput
                        placeholder='Email...'
                        type='text'
                        name='email'
                        iconname='users_circle-08'
                        inputgroupclassname='no-border form-control-lg'
                      />
                      <FormikInput
                        placeholder='Password...'
                        type='password'
                        name='password'
                        iconname='text_caps-small'
                        inputgroupclassname='no-border form-control-lg'
                      />
                    </CardBody>
                    <CardFooter>
                      <Button block type='submit' color='primary' size='lg' className='mb-3 btn-round'>
                        Login
                      </Button>
                      <div className='pull-left'>
                        <h6>
                          <Link to={AUTH + SIGNUP} className='link footer-link'>
                            Create Account
                          </Link>
                        </h6>
                      </div>
                      <div className='pull-right'>
                        <h6>
                          <Link to={AUTH + FORGOT_PW} className='link footer-link'>
                            Forgot Password?
                          </Link>
                        </h6>
                      </div>
                    </CardFooter>
                  </Card>
                </FormikForm>
              </Formik>
            </Col>
          </Container>
        </div>
      </div>
      <div className='full-page-background' style={{ backgroundImage: `url(${bgImage})` }} />
    </React.Fragment>
  );
};

export default SignIn;
