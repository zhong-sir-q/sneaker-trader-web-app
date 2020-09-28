import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from 'formik';

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Col, FormGroup, Alert } from 'reactstrap';

// core components
import PanelHeader from 'components/PanelHeader';
import FormikLabelInput from 'components/formik/FormikLabelInput';

import { User, AppUser } from '../../../shared';

import UserControllerInstance from 'api/controllers/UserController';
import { AccountCircle } from '@material-ui/icons';
import { useAuth } from 'providers/AuthProvider';

const INIT_USER: Omit<AppUser, 'signinMethod'> = {
  username: '',
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  phoneNo: '',
  // email is not in the form, but it is used to query the user
  email: '',
  // this field is the same as above
  profilePicUrl: '',
};

const nameIfUndefined = (message: string, ...names: (string | undefined)[]) => {
  const validNames = names.filter((n) => n);
  const name = validNames.length > 0 ? validNames.reduce((prev, curr) => prev + ' ' + curr, '') : message;

  return name;
};

const UserProfile = () => {
  const [user, setUser] = useState(INIT_USER);
  const [successEdit, setSuccessEdit] = useState(false);
  const { currentUser } = useAuth();

  const onAlertDismiss = () => setSuccessEdit(false);

  useEffect(() => {
    (async () => {
      if (currentUser) setUser(currentUser);
    })();
  }, [currentUser]);

  const handleSubmit = async (formStates: User) => {
    await UserControllerInstance.update(formStates);
    setSuccessEdit(true);
    setUser(formStates);
  };

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Alert color='info' isOpen={successEdit} toggle={onAlertDismiss}>
          Changes have been saved
        </Alert>
        <Row>
          <Formik
            initialValues={user as User}
            enableReinitialize
            onSubmit={async (formStates, { setFieldError }) => {
              try {
                await UserControllerInstance.getByUsername(formStates.username);
              } catch (err) {
                setFieldError('username', err.message);
                return;
              }

              await handleSubmit(formStates);
            }}
          >
            <Col md='8'>
              <Card>
                <CardHeader>
                  <h5 className='title'>Profile</h5>
                </CardHeader>
                <CardBody>
                  <FormikForm>
                    <Row>
                      <Col className='pr-1' md='3'>
                        <FormGroup>
                          <FormikLabelInput name='username' placeholder='Username' type='text' label='Username' />
                        </FormGroup>
                      </Col>
                      <Col className='pr-1' md='3'>
                        <FormGroup>
                          <FormikLabelInput name='firstName' placeholder='First Name' type='text' label='First Name' />
                        </FormGroup>
                      </Col>
                      <Col className='pl-1' md='3'>
                        <FormGroup>
                          <FormikLabelInput name='lastName' placeholder='Last Name' type='text' label='Last Name' />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='pr-1' md='3'>
                        <FormGroup>
                          <FormikLabelInput name='phoneNo' placeholder='Phone no.' type='text' label='Phone Number' />
                        </FormGroup>
                      </Col>
                      {/* TODO: one should be select and the other is datetime or force check
                          the date must be in the correct format and gender should have the desired values */}
                      <Col className='pr-1' md='3'>
                        <FormGroup>
                          <FormikLabelInput name='gender' placeholder='Gender' type='text' label='Gender' />
                        </FormGroup>
                      </Col>
                      <Col className='px-1' md='3'>
                        <FormGroup>
                          <FormikLabelInput name='dob' placeholder='dd/mm/yyyy' type='text' label='Date of Birth' />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button type='submit' color='primary'>
                      Save Changes
                    </Button>
                  </FormikForm>
                </CardBody>
              </Card>
            </Col>
          </Formik>

          <Col md='4'>
            <Card className='card-user'>
              <CardBody>
                <div className='text-center'>
                  {user.profilePicUrl ? (
                    <img style={{ maxWidth: '100px' }} alt='user profile' src={user.profilePicUrl} />
                  ) : (
                    <AccountCircle style={{ maxWidth: '100px', width: '100%', height: '100%' }} />
                  )}
                  <h5 className='title'>{nameIfUndefined('Opps, no full name', user.firstName, user.lastName)}</h5>
                  <p className='description'>{nameIfUndefined('Ouch, where is my username', user.username)}</p>
                </div>
              </CardBody>
              <hr />
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
