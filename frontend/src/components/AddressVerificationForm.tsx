import React, { useState } from 'react';

import { Formik, Form as FormikForm } from 'formik';

import { FormGroup, Row, Col, Card, CardBody, CardFooter, CardHeader, Button } from 'reactstrap';
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField } from '@material-ui/core';

import * as Yup from 'yup';

import FormikLabelInput from './formik/FormikLabelInput';
import FormikAutoSuggestInput from './formik/FormikAutoSuggestInput';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

import { Address } from '../../../shared';
import { required, equalDigits } from 'utils/yup';

import { cities, regions } from 'data/nz';
import AddressControllerInstance from 'api/controllers/AddressController';
import { useAuth } from 'providers/AuthProvider';

import onSubmitAddrVerificationForm from 'usecases/address_verification/onSubmitAddrVerificationForm';
import completeVerifyAddress from 'usecases/address_verification/completeVerifyAddress';
import AlertDialog from './AlertDialog';

export const DEFAULT_ADDRESS: Omit<Address, 'zipcode'> & { zipcode: number | '' } = {
  street: '',
  city: '',
  region: '',
  suburb: '',
  zipcode: '',
  country: 'New Zealand',
  verificationStatus: 'not_verified',
};

type AddressVerificationFormProps = {
  address: Address;
  goLoadAddress: () => void;
};

const validationSchema = Yup.object({
  street: required(),
  city: required(),
  region: required(),
  zipcode: equalDigits(4),
  country: required(),
  suburb: required(),
});

const AddressVerificationForm = (props: AddressVerificationFormProps) => {
  const { address } = props;

  const { currentUser } = useAuth();

  const confirmCodeDialogHook = useOpenCloseComp();
  const updateAddressSuccessAlertHook = useOpenCloseComp();
  const addrVerifiedSuccessAlertHook = useOpenCloseComp();
  const invalidCodeAlertHook = useOpenCloseComp();
  const requestVerificationAlertHook = useOpenCloseComp();

  const [verificationCode, setVerificationCode] = useState<number>();

  const onChangeVerificationCode = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setVerificationCode(Number(evt.target.value));

  const btnText = () =>
    address.verificationStatus === 'not_verified'
      ? 'Verify Address'
      : address.verificationStatus === 'in_progress'
      ? 'Complete Verification'
      : 'Update Address';

  const disableField = () => address.verificationStatus === 'in_progress';

  const onFailCompleteVerification = () => invalidCodeAlertHook.onOpen();

  const onSuccessCompleteVerification = async () => {
    addrVerifiedSuccessAlertHook.onOpen();
    confirmCodeDialogHook.onClose();
    props.goLoadAddress();
  };

  const onConfirmCode = async () => {
    if (!verificationCode || !currentUser) return;

    await completeVerifyAddress(
      AddressControllerInstance,
      onFailCompleteVerification,
      onSuccessCompleteVerification
    )(currentUser.id, verificationCode);
  };

  const onUpdateAddressSuccess = () => updateAddressSuccessAlertHook.onOpen();
  const onRequestVerificationSuccess = () => requestVerificationAlertHook.onOpen();

  const onSubmit = async (addr: Address) => {
    if (!currentUser) return;

    await onSubmitAddrVerificationForm(
      AddressControllerInstance,
      onUpdateAddressSuccess,
      onRequestVerificationSuccess
    )(currentUser.id, addr);

    props.goLoadAddress();
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={address}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(formValues) => onSubmit(formValues)}
      >
        {(formikProps) => (
          <FormikForm>
            <Card>
              <CardHeader>
                <h5 className='title'>Address</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <FormGroup>
                      <FormikLabelInput disabled={disableField()} name='street' type='text' label='Street Address' />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <FormikLabelInput disabled={disableField()} name='suburb' type='text' label='Suburb' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <FormikAutoSuggestInput
                        disabled={disableField()}
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
                        disabled={disableField()}
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
                      <FormikLabelInput
                        disabled={disableField()}
                        name='zipcode'
                        type='number'
                        label='Postal / Zip Code'
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <FormikLabelInput disabled name='country' type='text' label='Country' />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                {address.verificationStatus === 'in_progress' ? (
                  <Button color='primary' type='button' onClick={confirmCodeDialogHook.onOpen}>
                    {btnText()}
                  </Button>
                ) : (
                  <Button color='primary' type='submit'>
                    {btnText()}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </FormikForm>
        )}
      </Formik>

      <Dialog open={confirmCodeDialogHook.open} onClose={confirmCodeDialogHook.onClose}>
        <DialogTitle>Complete Address Verification</DialogTitle>
        <DialogContent>
          <TextField
            inputProps={{ onChange: onChangeVerificationCode }}
            margin='dense'
            name='verificationCode'
            label='Verification Code'
            type='number'
            placeholder='6 digit code'
            // restrict the text field input to 6 digits
            onInput={(e) => {
              if (!(e.target as any).value) return;

              (e.target as any).value = Math.max(0, parseInt((e.target as any).value))
                .toString()
                .slice(0, 6);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmCodeDialogHook.onClose}>Cancel</Button>
          <Button color='primary' onClick={onConfirmCode}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog
        message='A verification code will be sent to your address by mail.'
        open={requestVerificationAlertHook.open}
        color='info'
        onClose={requestVerificationAlertHook.onClose}
      />

      <AlertDialog
        message='Address is updated, we will send you a verification code by mail.'
        open={updateAddressSuccessAlertHook.open}
        color='primary'
        onClose={updateAddressSuccessAlertHook.onClose}
        maxWidth='sm'
      />

      <AlertDialog
        message='Congratulations, your address is verified!'
        open={addrVerifiedSuccessAlertHook.open}
        color='success'
        onClose={addrVerifiedSuccessAlertHook.onClose}
      />

      <AlertDialog
        message='Verification code is not valid.'
        open={invalidCodeAlertHook.open}
        color='danger'
        onClose={invalidCodeAlertHook.onClose}
      />
    </React.Fragment>
  );
};

export default AddressVerificationForm;
