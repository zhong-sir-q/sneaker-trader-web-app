import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Hub } from 'aws-amplify';
import { AmplifyGoogleButton, AmplifyFacebookButton } from '@aws-amplify/ui-react';
import { useHistory, Link } from 'react-router-dom';

// reactstrap components
import { Card, CardBody, CardHeader, CardFooter, Container, Col, Button } from 'reactstrap';
import * as Yup from 'yup';

// components
import InputFieldError from 'components/InputFieldError';
import FormikInput from 'components/formik/FormikInput';

import { validEmail, minCharacters } from 'utils/yup';

import { SIGNUP, AUTH, FORGOT_PW } from 'routes';

import stLogo from 'assets/img/logo_transparent_background.png';
import bgImage from 'assets/img/bg14.jpg';
import { fetchUserByEmail } from 'api/api';
import { signIn } from 'utils/auth';

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
  const history = useHistory();

  const redirectAfterLoginSuccess = () => {
    // the state is the pathname passed from SellerList
    if (history.location.state) history.push(history.location.state);
    else history.push('/');
  };

  useEffect(() => {
    // use the hub to redirect the user when they sign in using social logins
    // TODO: create the user in the database if not exists, it will have to be a federated user
    // so call a API route such as /api/federatedUser
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      if (event === 'signIn') {
        // NOTE: edge case, this email may be the same acroos
        // social media and the one user uses to signin
        // this case HAS NOT BEEN handled
        const user = await fetchUserByEmail(data.email).catch((err) => console.log(err));
        // handle the error
        if (!user) {
        }

        redirectAfterLoginSuccess();
      }
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
                  const loginResult = await signIn(formStates.email, formStates.password);

                  if (loginResult.message) {
                    setLoginError(loginResult.message);
                    return;
                  }

                  redirectAfterLoginSuccess();
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
