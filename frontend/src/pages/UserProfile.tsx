import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from 'formik';

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Col, FormGroup, Alert } from 'reactstrap';

// core components
import PanelHeader from 'components/PanelHeader';
import FormikLabelInput from 'components/formik/FormikLabelInput';
import { User } from '../../../shared';
import { updateUser } from 'api/api';
import { getCurrentUser } from 'utils/auth';

const INIT_USER: User = {
  username: '',
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  phoneNo: '',
  // email is not in the form, but it is used to query the user
  email: '',
};

const nameIfUndefined = (message: string, ...names: (string | undefined)[]) => {
  const validNames = names.filter((n) => n);
  const name = validNames.length > 0 ? validNames.reduce((prev, curr) => prev + ' ' + curr, '') : message;

  return name;
};

const UserProfile = () => {
  const [user, setUser] = useState(INIT_USER);
  const [successEdit, setSuccessEdit] = useState(false);

  const onAlertDismiss = () => setSuccessEdit(false);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    })();
  }, []);

  const handleSubmit = async (formStates: User) => {
    // TODO: check if the user name is already in use upon submit
    // DO NOT make the api calls if none of the fields have been touched!

    const res = await updateUser({ ...formStates, email: user.email }).catch((err) => console.log(err));
    // handle the error
    if (!res) return;

    setSuccessEdit(true);
    // update is successful
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
          <Formik initialValues={user} enableReinitialize onSubmit={handleSubmit}>
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
              <div className='image'>
                <img alt='...' src={require('assets/img/bg5.jpg')} />
              </div>
              <CardBody>
                <div className='author'>
                  <a href='#pablo' onClick={(e) => e.preventDefault()}>
                    <img alt='...' className='avatar border-gray' src={require('assets/img/mike.jpg')} />
                    <h5 className='title'>{nameIfUndefined('Opps, no full name', user.firstName, user.lastName)}</h5>
                  </a>
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
