import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Link, useHistory, useLocation } from 'react-router-dom';

// reactstrap components
import { Card, CardBody, CardHeader, CardFooter, Container, Col, Button } from 'reactstrap';
import styled from 'styled-components';

import queryString from 'query-string';
import jwt_decode from "jwt-decode"
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
import formatApiEndpoint from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

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

type GoogleSinginButtonProps = {
  onClick: () => void;
  img: string;
  btnText: string;
};

const StyledSigninButton = styled.button`
  background-color: white;
  color: black;
  width: 100%;
  font-size: 1em;
  padding: 10px 0;
  margin-bottom: 15px;
`;

const StyledSigninButtonImg = styled.img`
  margin-bottom: 3px;
  margin-right: 5px;
  width: 20px;
`;

const SigninButton = (props: GoogleSinginButtonProps) => {
  return (
    <StyledSigninButton onClick={props.onClick} type='button'>
      <StyledSigninButtonImg alt='Signin button image' src={props.img} />
      {props.btnText}
    </StyledSigninButton>
  );
};

const googleOAuth2Url = () => {
  const oauthConsentUrl = 'https://accounts.google.com/o/oauth2/auth';
  const response_type = 'code';
  const client_id = '1021202892438-g7803i6ust97vvb8mojt8lneu1fdajgd.apps.googleusercontent.com';
  const scope = 'openid email profile';
  const redirect_uri = 'https://localhost:3000/auth/signin';

  const queries = queryString.stringify({ response_type, client_id, scope, redirect_uri });

  return oauthConsentUrl + '?' + queries;
};

// sign in with google by redirect
const GoogleSigninButton = () => {
  // TODO: store and use the image locally
  const btnImg =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png';

  return (
    <SigninButton
      img={btnImg}
      btnText='Signin With Google'
      onClick={() => (window.location.href = googleOAuth2Url())}
    />
  );
};

const SignIn = () => {
  const [loginError, setLoginError] = useState<string>();

  const location = useLocation();

  const exchangeCodeForTokens = (code: string) => fetch(formatApiEndpoint('auth/google/tokens'), formatRequestOptions({ code })).then(res => res.json())

  useEffect(() => {
    const { search } = location;

    const urlParams = new URLSearchParams(search)
    const googleAuthCode = urlParams.get('code')
    
    // the user has signed in successfully with google
    if (googleAuthCode) {
      // retrive the info about the user and signin with AWS
      (async () => {
        console.log('I am here')
        // user may input random auth code into the url and that will invalidate the request
        const tokens = await exchangeCodeForTokens(googleAuthCode)

        console.log(tokens)

        // const googleUser = jwt_decode(id_token)
        // console.log(googleAuthCode)
      })()
    }
  }, [location]);

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
                      <GoogleSigninButton />
                      {/* <SignInWithGoogle handleSignin={updateLoginErr} /> */}
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
