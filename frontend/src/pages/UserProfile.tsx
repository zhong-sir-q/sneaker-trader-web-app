import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik, Field } from 'formik';

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Col, FormGroup, Label } from 'reactstrap';

import { Tooltip } from '@material-ui/core';
import { HouseOutlined } from '@material-ui/icons';

import * as Yup from 'yup';

// core components
import PanelHeader from 'components/PanelHeader';
import FormikLabelInput from 'components/formik/FormikLabelInput';

import { User, Address } from '../../../shared';

import AddressVerificationForm, { DEFAULT_ADDRESS } from 'components/AddressVerificationForm';
import AlertDialog from 'components/AlertDialog';
import ImageUpload from 'components/ImageUpload';
import FormikDatetime from 'components/formik/FormikDatetime';
import CenterSpinner from 'components/CenterSpinner';

import UserControllerInstance from 'api/controllers/UserController';
import { useAuth } from 'providers/AuthProvider';

import { checkDuplicateUsername, validDate } from 'utils/yup';

import defaultAvatar from 'assets/img/placeholder.jpg';

import AwsControllerInstance from 'api/controllers/AwsController';
import AddressControllerInstance from 'api/controllers/AddressController';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

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

type BadgesProp = {
  addressVerified: boolean;
};

const Badges = (props: BadgesProp) => {
  const { addressVerified } = props;

  return (
    <React.Fragment>
      {addressVerified && (
        <Tooltip title='Address Verified'>
          <HouseOutlined style={{ color: 'green', fontSize: '2em' }} />
        </Tooltip>
      )}
    </React.Fragment>
  );
};

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

  // initialization
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
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <CenterSpinner fullScreenHeight />
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <AlertDialog color='info' open={openAlert} onClose={onDismissAlert} message='Changes have been saved' />
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
                  {/* avatar, fullname, email and username */}
                  <CardBody>
                    <div className='text-center'>
                      {/* badges on the top left corner */}
                      <div style={{ position: 'absolute' }}>
                        <Badges
                          addressVerified={userAddr !== undefined && userAddr.verificationStatus === 'verified'}
                        />
                      </div>
                      <ImageUpload
                        imgPreviewUrl={
                          formikProps.values.profilePicUrl ? formikProps.values.profilePicUrl : defaultAvatar
                        }
                        canAddImage={!formikProps.values.profilePicUrl}
                        onImageChange={handleImageChange(formikProps.setFieldValue)}
                      />
                      <h5 className='title'>
                        {nameIfUndefined('No full name...', currentUser.firstName, currentUser.lastName)}
                      </h5>
                      <p className='description'>{currentUser.email}</p>
                      <p className='description'>{nameIfUndefined('No username...', currentUser.username)}</p>
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
