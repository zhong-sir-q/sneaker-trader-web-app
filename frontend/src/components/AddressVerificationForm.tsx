import React, { useState } from 'react';

import { Formik, Form as FormikForm } from 'formik';

import { FormGroup, Row, Col, Card, CardBody, CardFooter, CardHeader, Button } from 'reactstrap';
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField } from '@material-ui/core';

import * as Yup from 'yup';

import FormikLabelInput from './formik/FormikLabelInput';
import FormikAutoSuggestInput from './formik/FormikAutoSuggestInput';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

import { Address } from '../../../shared';
import { required } from 'utils/yup';

import { cities, regions } from 'data/nz';
import AddressControllerInstance from 'api/controllers/AddressController';
import { useAuth } from 'providers/AuthProvider';

import onVerifyAddress from 'usecases/onVerifyAddress';

type AddressVerificationFormProps = {
  address: Address;
};

const validationSchema = Yup.object({
  street: required(),
  city: required(),
  region: required(),
  zipcode: required(),
  country: required(),
});

const AddressVerificationForm = (props: AddressVerificationFormProps) => {
  const { address } = props;

  const { currentUser } = useAuth();
  const { open, onClose, onOpen } = useOpenCloseComp();

  const [verificationCode, setVerificationCode] = useState<number>();

  const btnText = () =>
    address.verificationStatus === 'not_verified'
      ? 'Verify Address'
      : address.verificationStatus === 'in_progress'
      ? 'Complte Verification'
      : 'Update Address';

  // match the code
  const completeVerifyAddress = async (userId: number, code: number) => {
    const isValidCode = await AddressControllerInstance.validateCodeByUserID(userId, code);
    if (!isValidCode) {
      alert('Verification code is not valid');
      return;
    }

    alert('Congratulations, your address is verified!');
  };

  const updateAddress = async (userId: number, addressValues: Address) => {
    await AddressControllerInstance.updateAddressByUserId(userId, addressValues);
    alert('Address is updated!');
  };

  const onSubmit = (formValues: Address) => {
    if (!currentUser) return;

    switch (address.verificationStatus) {
      case 'in_progress':
        return;
      case 'not_verified':
        onVerifyAddress(currentUser.id, formValues);
        return;
      case 'verified':
        updateAddress(currentUser.id, formValues);
        return;
      default:
        throw new Error('Invalid address status');
    }
  };

  const onChangeVerificationCode = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setVerificationCode(Number(evt.target.value));

  return (
    <Card>
      <CardHeader>
        <h5 className='title'>Address</h5>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={address}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(formValues) => onSubmit(formValues)}
        >
          {(formikProps) => (
            <FormikForm>
              <FormGroup>
                <FormikLabelInput name='street' type='text' label='Street Address' />
              </FormGroup>
              <Row>
                <Col>
                  <FormGroup>
                    <FormikAutoSuggestInput
                      name='city'
                      label='City'
                      options={cities}
                      setfieldvalue={formikProps.setFieldValue}
                    />
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <FormikAutoSuggestInput
                      name='region'
                      label='Region'
                      options={regions}
                      setfieldvalue={formikProps.setFieldValue}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <FormikLabelInput name='zipcode' type='number' label='Postal / Zip Code' />
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <FormikLabelInput disabled name='country' type='text' label='Country' />
                  </FormGroup>
                </Col>
              </Row>
            </FormikForm>
          )}
        </Formik>
      </CardBody>
      <CardFooter>
        <Button
          color='primary'
          type='submit'
          onClick={() => {
            if (address.verificationStatus !== 'in_progress') return;

            onOpen();
          }}
        >
          {btnText()}
        </Button>
      </CardFooter>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Complete Address Verification</DialogTitle>
        <DialogContent>
          <TextField
            inputProps={{ onChange: onChangeVerificationCode }}
            margin='dense'
            name='verificationCode'
            label='Verification Code'
            type='number'
            placeholder='6 digit code'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color='primary'
            onClick={() => {
              if (!verificationCode || !currentUser) return;
              completeVerifyAddress(currentUser.id, verificationCode);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AddressVerificationForm;
