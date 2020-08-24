import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { Formik, Form as FormikForm } from 'formik';
import { Card, CardBody, CardFooter, Button, CardTitle, CardText, Container, Col, Row, CardHeader } from 'reactstrap';
import * as Yup from 'yup';

import { FormikInput } from './SignUp';
import { ADMIN, DASHBOARD } from 'routes';

import requestCodeBgimg from 'assets/img/bg13.jpg';
import confirmCodeBgImg from 'assets/img/bg15.jpg';

const validateEmailSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('* Required'),
});

interface RequestCodeProps {
  handleSubmitEmail: (email: string) => void;
  handleCodeSent: () => void;
}

const formatErrorMessage = (res: { code: string; message: string; name: string }) => {
  switch (res.code) {
    case 'UserNotFoundException':
      return 'User does not exist';
    default:
      return res.code;
  }
};

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
                    setRequestCodeError(formatErrorMessage(forgotPasswordResponse));
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

// NOTE: reusing the logic from the Signup form
const validateConfirmCodeSchema = Yup.object({
  code: Yup.string().length(6, 'Code must be 6 characters long').required('* Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('* Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Password must match')
    .required('* Required'),
});

interface ConfirmCodeProps {
  email: string;
}

const rangeOutOfBounds = (s: string, lo: number, hi: number) => {
  return lo < 0 || hi >= s.length || lo > hi;
};

// replace all character in the range (start to end) with the characters specified
const obfuscate = (text: string, start: number, end: number, repl: string): string => {
  if (!text || text === '') return '';

  // checking out of bounds
  if (rangeOutOfBounds(text, start, end)) return text;

  const head = text.slice(0, start);
  const tail = text.slice(end + 1);
  // start and end is 0-indexed respectively
  const body = repl.repeat(end - start + 1);

  return head + body + tail;
};

// given, dummy@gmail.com, obfuscate it to d***y@g***l.com. That is replace the
// first to the second to the last characters of the name and the domain with *

// assume the email is always valid
const obfuscateEmail = (email: string): string => {
  const emailArray = email.split('@');

  const domainArray = emailArray[emailArray.length - 1].split('.');
  const name = emailArray[0];

  emailArray[0] = obfuscate(name, 1, name.length - 2, '*');

  const domain = domainArray[0];
  domainArray[0] = obfuscate(domain, 1, domain.length - 2, '*');

  emailArray[emailArray.length - 1] = domainArray.join('.');

  return emailArray.join('@');
};

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
                      setConfirmCodeError(formatErrorMessage(error));
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
