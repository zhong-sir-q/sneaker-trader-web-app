import React, { useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Auth } from 'aws-amplify';
import { Redirect, useHistory } from 'react-router-dom';

// reactstrap components
import { Card, CardBody, CardHeader, CardFooter, Container, Col, Button } from 'reactstrap';

import * as Yup from 'yup';

import nowLogo from 'assets/img/now-logo.png';

import bgImage from 'assets/img/bg14.jpg';
import { SIGNUP, AUTH } from 'routes';
import { FormikInput, FieldError } from './SignUp';

type SignInFormStateType = {
  email: string;
  password: string;
};

const INIT_FORM_STATES: SignInFormStateType = {
  email: '',
  password: '',
};

// prompt the user that this field is required if they leave it blank
const REQUIRED = '* Required';

// NOTE: I am reusing the logic and the REQUIRED variable from SignUp.tsx
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required(REQUIRED),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required(REQUIRED),
});

const cognitoSignIn = (email: string, pw: string) =>
  Auth.signIn(email, pw)
    .then((user) => user)
    .catch((err) => err);

const SignIn = () => {
  const [loginError, setLoginError] = useState<string>();
  const history = useHistory();

  return (
    <React.Fragment>
      <div className="content">
        <div className="login-page">
          <Container>
            <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
              <Formik
                initialValues={INIT_FORM_STATES}
                validationSchema={validationSchema}
                onSubmit={async (formStates) => {
                  /**
                   * - login the user
                   *
                   * If successful:
                   * - redirect the user to the dashboard for now
                   * - persist the login state
                   */

                  const loginResult = await cognitoSignIn(formStates.email, formStates.password);

                  if (loginResult.message) {
                    // TODO; get Aaron's opinion compare to the signup page,
                    // prefer displaying the message or a pop up alert?

                    // display the error
                    setLoginError(loginResult.message);
                    return;
                  }

                  // TODO: change to the dashboard page
                  history.push(AUTH + SIGNUP);
                }}
              >
                <FormikForm>
                  <Card className="card-login card-plain">
                    <CardHeader>
                      <div className="logo-container">
                        <img src={nowLogo} alt="now-logo" />
                      </div>
                    </CardHeader>
                    <CardBody>
                      {loginError && <FieldError error={loginError} />}

                      <FormikInput
                        placeholder="Email..."
                        type="text"
                        name="email"
                        iconname="users_circle-08"
                        inputgroupclassname="no-border form-control-lg"
                      />
                      <FormikInput
                        placeholder="Password..."
                        type="password"
                        name="password"
                        iconname="text_caps-small"
                        inputgroupclassname="no-border form-control-lg"
                      />
                    </CardBody>
                    <CardFooter>
                      <Button block type="submit" color="primary" size="lg" className="mb-3 btn-round">
                        Get Started
                      </Button>
                      <div className="pull-left">
                        <h6>
                          <a href={AUTH + SIGNUP} className="link footer-link">
                            Create Account
                          </a>
                        </h6>
                      </div>
                      <div className="pull-right">
                        <h6>
                          <a href="#help" className="link footer-link">
                            Need Help?
                          </a>
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
      <div className="full-page-background" style={{ backgroundImage: 'url(' + bgImage + ')' }} />
    </React.Fragment>
  );
};

export default SignIn;
