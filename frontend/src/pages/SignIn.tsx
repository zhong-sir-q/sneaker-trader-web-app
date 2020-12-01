import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Link, useHistory, useLocation } from 'react-router-dom';

// reactstrap components
import { Card, CardBody, CardHeader, CardFooter, Container, Col, Button } from 'reactstrap';
import styled from 'styled-components';

import * as Yup from 'yup';

// components
import InputFieldError from 'components/InputFieldError';
import FormikInput from 'components/formik/FormikInput';

import { validEmail, minCharacters } from 'utils/yup';

import { SIGNUP, AUTH, FORGOT_PW, HOME, SIGNIN } from 'routes';

import stLogo from 'assets/img/logo_transparent_background.png';
import bgImage from 'assets/img/bg14.jpg';
import { signIn } from 'utils/auth';
import SignInWithFacebook from 'components/buttons/SignInWithFacebook';

import googleLogo from 'assets/img/google_logo_svg.png';
import {
  GoogleOauth2Controller,
  FederatedSigninError,
  signinWithGoogleCredentials,
} from 'api/controllers/external/GoogleOauth2Controller';

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

// refactor the goolge sign in code to separate files

type FederatedSigninButtonProps = {
  onClick: () => void;
  img: string;
  btnText: string;
};

const StyledFederatedSigninButton = styled.button`
  background-color: white;
  color: black;
  width: 100%;
  font-size: 1em;
  padding: 10px 0;
  margin-bottom: 15px;
`;

const StyledFederatedSigninButtonImg = styled.img`
  margin-bottom: 3px;
  margin-right: 5px;
  width: 20px;
`;

const FederatedSigninButton = (props: FederatedSigninButtonProps) => {
  return (
    <StyledFederatedSigninButton onClick={props.onClick} type='button'>
      <StyledFederatedSigninButtonImg alt='Signin button image' src={props.img} />
      {props.btnText}
    </StyledFederatedSigninButton>
  );
};

type GoogleSigninButtonProps = {
  googleOauth2Controller: GoogleOauth2Controller;
};

// sign in with google by redirect
const GoogleSigninButton = (props: GoogleSigninButtonProps) => {
  const redirectToGoogleAuthUrl = async () => {
    const authUrl = await props.googleOauth2Controller.createAuthUrl();
    window.location.href = authUrl;
  };

  return <FederatedSigninButton img={googleLogo} btnText='Sign in with Google' onClick={redirectToGoogleAuthUrl} />;
};

type SigninProps = {
  googleOauth2Controller: GoogleOauth2Controller;
};

const SignIn = (props: SigninProps) => {
  const [loginError, setLoginError] = useState<string>();

  const location = useLocation();
  const history = useHistory();

  // listen for the location to sign in the user with Google credentials
  useEffect(() => {
    const { search } = location;

    const urlParams = new URLSearchParams(search);
    const googleAuthCode = urlParams.get('code');

    // the user has granted the consent with google
    if (googleAuthCode) {
      signinWithGoogleCredentials(props.googleOauth2Controller, googleAuthCode).catch((err) => {
        if (err instanceof FederatedSigninError) setLoginError(err.message);
        // clears the google auth code from the url
        history.push(AUTH + SIGNIN);
      });
    }
  }, [location, history, props.googleOauth2Controller]);

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
                {(formikProps) => (
                  <FormikForm>
                    <Card className='card-login card-plain'>
                      <CardHeader>
                        <div className='logo-container' style={{ width: '120px', marginBottom: '35px' }}>
                          <Link to={HOME}>
                            <img src={stLogo} alt='sneakertrader-logo' />
                          </Link>
                        </div>
                        <GoogleSigninButton googleOauth2Controller={props.googleOauth2Controller} />
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
                          data-testid='email-input'
                          onChange={(e: any) => {
                            // AWS Amplify is case-sensitive about the keys
                            e.target.value = (e.target.value as string).toLowerCase();
                            formikProps.handleChange(e);
                          }}
                        />
                        <FormikInput
                          placeholder='Password...'
                          type='password'
                          name='password'
                          iconname='text_caps-small'
                          inputgroupclassname='no-border form-control-lg'
                          data-testid='password-input'
                        />
                      </CardBody>
                      <CardFooter>
                        <Button
                          block
                          type='submit'
                          color='primary'
                          size='lg'
                          className='mb-3 btn-round'
                          data-testid='signin-btn'
                        >
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
                )}
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
