import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik, Field } from 'formik';

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Col, FormGroup, Alert, Label } from 'reactstrap';

import * as Yup from 'yup';

// core components
import PanelHeader from 'components/PanelHeader';
import FormikLabelInput from 'components/formik/FormikLabelInput';

import { User, Address } from '../../../shared';
import CenterSpinner from 'components/CenterSpinner';

import UserControllerInstance from 'api/controllers/UserController';
import { useAuth } from 'providers/AuthProvider';

import { checkDuplicateUsername, validDate } from 'utils/yup';

import ImageUpload from 'components/ImageUpload';

import defaultAvatar from 'assets/img/placeholder.jpg';

import AwsControllerInstance from 'api/controllers/AwsController';
import AddressVerificationForm, { DEFAULT_ADDRESS } from 'components/AddressVerificationForm';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import AddressControllerInstance from 'api/controllers/AddressController';
import FormikDatetime from 'components/formik/FormikDatetime';

// user may have empty firstname or empty lastname or both
const nameIfUndefined = (alternativeName: string, ...names: (string | undefined)[]) => {
  const validNames = names.filter((n) => n);
  const name = validNames.length > 0 ? validNames.reduce((prev, curr) => prev + ' ' + curr, '') : alternativeName;

  return name;
};

const validationSchema = (userId: number) =>
  Yup.object({
    username: checkDuplicateUsername(userId),
    dob: validDate('MM/DD/YYYY'),
  });

const UserProfile = () => {
  const openCloseAlertHook = useOpenCloseComp();

  const openAlert = openCloseAlertHook.open;
  const onShowAlert = openCloseAlertHook.onOpen;
  const onDismissAlert = openCloseAlertHook.onClose;

  const [profileImgFile, setProfileImgFile] = useState<File>();

  const { currentUser, updateCurrentUser } = useAuth();
  const [userAddr, setUserAddr] = useState<Address>();

  const [loadAddress, setLoadAddress] = useState(true);

  const goLoadAddress = () => setLoadAddress(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchAddr = async () => {
      const addr = await AddressControllerInstance.getAddressByUserId(currentUser.id);
      if (!addr) return;

      setUserAddr(addr);
    };

    if (loadAddress) {
      fetchAddr();
      setLoadAddress(false);
    }
  }, [currentUser, loadAddress]);

  const handleSubmit = async (formStates: User) => {
    if (profileImgFile) {
      const profileFormData = new FormData();
      profileFormData.append('file', profileImgFile);

      const s3ImgUrl = await AwsControllerInstance.uploadS3SignleImage(profileFormData);

      formStates = { ...formStates, profilePicUrl: s3ImgUrl };
    }

    await UserControllerInstance.update(formStates.email, formStates);
    onShowAlert();
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
        <Alert color='info' isOpen={openAlert} toggle={onDismissAlert}>
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
                            <Label>Date of Birth</Label>
                            <Field
                              name='dob'
                              timeFormat={false}
                              placeholder='Date Of Birth...'
                              component={FormikDatetime}
                            />
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

        <AddressVerificationForm address={userAddr || DEFAULT_ADDRESS} goLoadAddress={goLoadAddress} />
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
