import React, { useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Col, FormGroup, Alert } from 'reactstrap';

import * as Yup from 'yup';

// core components
import PanelHeader from 'components/PanelHeader';
import FormikLabelInput from 'components/formik/FormikLabelInput';

import { User } from '../../../shared';
import CenterSpinner from 'components/CenterSpinner';

import UserControllerInstance from 'api/controllers/UserController';
import { useAuth } from 'providers/AuthProvider';

import { checkDuplicateUsername, validDate } from 'utils/yup';

import ImageUpload from 'components/ImageUpload';

import defaultAvatar from 'assets/img/placeholder.jpg';

import AwsControllerInstance from 'api/controllers/AwsController';
import AddressVerificationForm from 'components/AddressVerificationForm';

// user may have empty firstname or empty lastname or both
const nameIfUndefined = (alternativeName: string, ...names: (string | undefined)[]) => {
  const validNames = names.filter((n) => n);
  const name = validNames.length > 0 ? validNames.reduce((prev, curr) => prev + ' ' + curr, '') : alternativeName;

  return name;
};

const validationSchema = (userId: number) =>
  Yup.object({
    username: checkDuplicateUsername(userId),
    dob: validDate(),
  });

const UserProfile = () => {
  const [successEdit, setSuccessEdit] = useState(false);
  const [profileImgFile, setProfileImgFile] = useState<File>();

  const { currentUser, updateCurrentUser } = useAuth();

  const onAlertDismiss = () => setSuccessEdit(false);

  const handleSubmit = async (formStates: User) => {
    if (profileImgFile) {
      const profileFormData = new FormData();
      profileFormData.append('file', profileImgFile);

      const s3ImgUrl = await AwsControllerInstance.uploadS3SignleImage(profileFormData);

      formStates = { ...formStates, profilePicUrl: s3ImgUrl };
    }

    await UserControllerInstance.update(formStates);
    setSuccessEdit(true);
    updateCurrentUser(formStates);
  };

  const handleImageChange = (setFieldValue: (field: string, value: string) => void) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue('profilePicUrl', reader.result as string);
      setProfileImgFile(file);
    };

    if (file) reader.readAsDataURL(file);
  };

  return !currentUser ? (
    <CenterSpinner />
  ) : (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Alert color='info' isOpen={successEdit} toggle={onAlertDismiss}>
          Changes have been saved
        </Alert>
        <Formik
          initialValues={currentUser}
          enableReinitialize
          validationSchema={validationSchema(currentUser.id)}
          onSubmit={(formStates) => handleSubmit(formStates)}
        >
          {(formikProps) => (
            <Row>
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
                            <FormikLabelInput
                              name='firstName'
                              placeholder='First Name'
                              type='text'
                              label='First Name'
                            />
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
                        <Col className='pr-1' md='3'>
                          <FormGroup>
                            <FormikLabelInput name='gender' placeholder='Gender' type='select' label='Gender'>
                              <option value=''>Not Chosen</option>
                              <option value='male'>Male</option>
                              <option value='female'>Female</option>
                              <option value='confidential'>Prefer not to say</option>
                            </FormikLabelInput>
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

              <Col md='4'>
                <Card className='card-user'>
                  <CardBody>
                    <div className='text-center'>
                      <ImageUpload
                        imgPreviewUrl={
                          formikProps.values.profilePicUrl ? formikProps.values.profilePicUrl : defaultAvatar
                        }
                        canAddImage={!formikProps.values.profilePicUrl}
                        onImageChange={handleImageChange(formikProps.setFieldValue)}
                      />
                      <h5 className='title'>
                        {nameIfUndefined('Opps, no full name', currentUser.firstName, currentUser.lastName)}
                      </h5>
                      <p className='description'>{currentUser.email}</p>
                      <p className='description'>
                        {nameIfUndefined('Ouch, where is my username', currentUser.username)}
                      </p>
                    </div>
                  </CardBody>
                  <hr />
                </Card>
              </Col>
            </Row>
          )}
        </Formik>

        <AddressVerificationForm
          address={{
            street: '',
            city: '',
            zipcode: ('' as unknown) as number,
            region: '',
            country: 'New Zealand',
            verificationStatus: 'in_progress',
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
