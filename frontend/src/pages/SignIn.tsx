import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Auth, Hub } from 'aws-amplify';
import { AmplifyGoogleButton, AmplifyFacebookButton } from '@aws-amplify/ui-react';
import { useHistory, Link } from 'react-router-dom';
// reactstrap components
import { Card, CardBody, CardHeader, CardFooter, Container, Col, Button } from 'reactstrap';
import * as Yup from 'yup';

// components
import InputFieldError from 'components/InputFieldError';
import FormikInput from 'components/formik/FormikInput';

import { validEmail, minCharacters } from 'utils/yup';

import { SIGNUP, AUTH, ADMIN, DASHBOARD, FORGOT_PW } from 'routes';

import stLogo from 'assets/img/logo_transparent_background.png';
import bgImage from 'assets/img/bg14.jpg';

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

const cognitoSignIn = (email: string, pw: string) =>
  Auth.signIn(email, pw)
    .then((user) => user)
    .catch((err) => err);

const SignIn = () => {
  const [loginError, setLoginError] = useState<string>();
  const history = useHistory();

  useEffect(() => {
    // use the hub to redirect the user when they sign in using social logins
    Hub.listen('auth', (data) => {
      if (data.payload.event === 'signIn') history.push(ADMIN + DASHBOARD);
    });

    // unsubscribe the Hub
    return () => Hub.remove('auth', () => {});
  });

  return (
    <React.Fragment>
      <div className='content'>
        <div className='login-page'>
          <Container>
            <Col xs={12} md={8} lg={4} className='ml-auto mr-auto'>
              <Formik
                initialValues={INIT_FORM_STATES}
                validationSchema={validationSchema}
                onSubmit={async (formStates) => {
                  const loginResult = await cognitoSignIn(formStates.email, formStates.password);

                  if (loginResult.message) {
                    // TODO; get Aaron's opinion compare to the signup page,
                    // prefer displaying the message or a pop up alert?

                    // display the error
                    setLoginError(loginResult.message);
                    return;
                  }

                  history.push(ADMIN + DASHBOARD);
                }}
              >
                <FormikForm>
                  <Card className='card-login card-plain'>
                    <CardHeader>
                      <div className='logo-container' style={{ width: '130px', marginBottom: '35px' }}>
                        <img src={stLogo} alt='now-logo' />
                      </div>
                      {/* TODO: Use own button for better customizations */}
                      {/* <Button onClick={() => { Auth.federatedSignIn({ provider: 'Google' }) }}>Sign In With Google</Button> */}
                      <AmplifyGoogleButton clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} />
                      <AmplifyFacebookButton appId={process.env.REACT_APP_FB_APP_ID} />
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
                        Get Started
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
