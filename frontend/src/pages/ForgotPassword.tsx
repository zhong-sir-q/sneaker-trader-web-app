import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { Formik, Form as FormikForm } from 'formik';
import { Card, CardBody, CardFooter, Button, CardTitle, CardText, Container, Col, Row, CardHeader } from 'reactstrap';
import * as Yup from 'yup';

import FormikInput from 'components/formik/FormikInput';
import { validEmail, minCharacters, matchingPassword } from 'utils/yup';
import { obfuscateEmail } from 'utils/obfuscateString';

import { ADMIN, DASHBOARD } from 'routes';

import requestCodeBgimg from 'assets/img/bg13.jpg';
import confirmCodeBgImg from 'assets/img/bg15.jpg';

// NOTE: this function can potentially used for other components that use Amplify functions
const formatAmplifyErrorMessage = (res: { code: string; message: string; name: string }) => {
  switch (res.code) {
    case 'UserNotFoundException':
      return 'User does not exist';
    default:
      return res.message;
  }
};

const validateEmailSchema = Yup.object({
  email: validEmail(),
});

interface RequestCodeProps {
  handleSubmitEmail: (email: string) => void;
  handleCodeSent: () => void;
}

const RequestCode = (props: RequestCodeProps) => {
  const [requestCodeError, setRequestCodeError] = useState<string>();

  return (
    <React.Fragment>
      <div className='content'>
        <section className='login-page'>
          <Container>
            <Col xs={12} md={8} lg={4} className='ml-auto mr-auto'>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={validateEmailSchema}
                onSubmit={async (formStates) => {
                  // send the code
                  const forgotPasswordResponse = await Auth.forgotPassword(formStates.email)
                    .then((res) => res)
                    .catch((err) => err);

                  if (forgotPasswordResponse.message) {
                    setRequestCodeError(formatAmplifyErrorMessage(forgotPasswordResponse));
                    return;
                  }

                  // update the email
                  props.handleSubmitEmail(formStates.email);
                  // go to the ConfirmCode
                  props.handleCodeSent();
                }}
              >
                <FormikForm>
                  <Card className='card-lock text-center'>
                    <CardTitle tag='h4'>Forgot your password?</CardTitle>
                    <CardBody>
                      {/* TODO: make the color red */}
                      {requestCodeError && <CardText style={{ color: 'red' }}>{requestCodeError}</CardText>}
                      <CardText>Enter your Email below and we will send a message to reset your password</CardText>
                      <FormikInput name='email' iconname='users_circle-08' type='text' placeholder='Email...' />
                    </CardBody>
                    <CardFooter>
                      <Button type='submit' color='primary' size='lg' className='mb-3 btn-round'>
                        Reset my password
                      </Button>
                    </CardFooter>
                  </Card>
                </FormikForm>
              </Formik>
            </Col>
          </Container>
        </section>
      </div>
      <div className='full-page-background' style={{ backgroundImage: `url(${requestCodeBgimg})` }} />
    </React.Fragment>
  );
};

const validateConfirmCodeSchema = Yup.object({
  code: Yup.string().length(6, 'Code must be 6 characters long').required('* Required'),
  password: minCharacters(8),
  confirmPassword: matchingPassword('password'),
});

interface ConfirmCodeProps {
  email: string;
}

const ConfirmCode = (props: ConfirmCodeProps) => {
  const history = useHistory();
  const [confirmCodeError, setConfirmCodeError] = useState<string>();

  return (
    <React.Fragment>
      <div className='content'>
        <section className='login-page'>
          <Container>
            <Row className='justify-content-center'>
              <Col xs={12} md={8} lg={4} className='ml-auto mr-auto'>
                <Formik
                  initialValues={{ code: '', password: '', confirmPassword: '' }}
                  validationSchema={validateConfirmCodeSchema}
                  onSubmit={async (formStates) => {
                    // confirm to reset the password
                    const error = await Auth.forgotPasswordSubmit(props.email, formStates.code, formStates.password).catch((err) => err);

                    // handle the error
                    if (error) {
                      setConfirmCodeError(formatAmplifyErrorMessage(error));
                      return;
                    }
                    
                    // NOTE: the user is not signed in after the password change
                    // display a success message to the user after they are signed in
                    history.push(ADMIN + DASHBOARD);
                  }}
                >
                  <FormikForm>
                    <Card className='card-lock'>
                      <CardHeader className='text-center'>
                        <CardTitle tag='h4'>Reset your password</CardTitle>
                        {confirmCodeError && <CardText style={{ color: 'red' }}>{confirmCodeError}</CardText>}
                        <CardText>
                          We have sent a password reset code by {obfuscateEmail(props.email)}. Use the code below to reset your password.
                        </CardText>
                      </CardHeader>
                      <CardBody>
                        <FormikInput name='code' iconname='users_circle-08' type='text' placeholder='Code...' />
                        <FormikInput name='password' iconname='users_circle-08' type='password' placeholder='Password...' />
                        <FormikInput name='confirmPassword' iconname='users_circle-08' type='password' placeholder='Confirm Password...' />
                      </CardBody>
                      <CardFooter className='text-center'>
                        <Button type='submit' color='primary' size='lg' className='mb-3 btn-round'>
                          Change Password
                        </Button>
                      </CardFooter>
                    </Card>
                  </FormikForm>
                </Formik>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <div className='full-page-background' style={{ backgroundImage: `url(${confirmCodeBgImg})` }} />
    </React.Fragment>
  );
};

// TODO: discuss with Aaron and change the UI of the page if needed
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const onCodeSent = () => setCodeSent(true);
  const onSubmitEmail = (submittedEmail: string) => setEmail(submittedEmail);

  return !codeSent ? <RequestCode handleCodeSent={onCodeSent} handleSubmitEmail={onSubmitEmail} /> : <ConfirmCode email={email} />;
};

export default ForgotPassword;
