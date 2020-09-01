import React from 'react';
import { Link } from 'react-router-dom';

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from 'reactstrap';

import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';
import { required, requiredPositiveNumber } from 'utils/yup';

import FormikLabelInput from './formik/FormikLabelInput';

import { DASHBOARD, ADMIN } from 'routes';
import { ListingFormSneakerStateType } from 'pages/ProductListingForm';

type SneakerInfoFormStateType = ListingFormSneakerStateType & { billingInfo: string };

type SneakerInfoFormProps = {
  formValues: SneakerInfoFormStateType;
  onSubmit: (sneaker: ListingFormSneakerStateType, billingInfo: string) => void;
};

const sneakerInfoValidation = Yup.object({
  name: required(),
  brand: required(),
  colorWay: required(),
  // TODO: should be a price limit, confirm with Aaron
  price: requiredPositiveNumber('Price'),
  // NOTE: should be between size 1 to 15 or something
  size: requiredPositiveNumber('Size'),
});

const SneakerInfoForm = (props: SneakerInfoFormProps) => {
  return (
    <Formik
      initialValues={props.formValues}
      validationSchema={sneakerInfoValidation}
      onSubmit={(formStates) => {
        const { billingInfo, ...sneaker } = formStates;
        props.onSubmit(sneaker, billingInfo);
      }}
      enableReinitialize
    >
      {(formikProps) => (
        <Col md='12'>
          <Card className='text-left'>
            <CardHeader>
              <h5 className='text-center title'>Sneaker Listing Form</h5>
            </CardHeader>
            <FormikForm>
              <CardBody>
                <Row>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput name='name' placeholder='Name' type='text' label='Shoe Name' />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      {/* TODO: this should be a select and autocomplete */}
                      <FormikLabelInput name='brand' placeholder='brand' type='text' label='Brand' />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      {/* TODO: this should be a select */}
                      <FormikLabelInput name='size' placeholder='Size' type='number' label='Shoe Size' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput name='colorWay' placeholder='Color Way' type='text' label='Color Way' />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput name='price' placeholder='$$ ~ $$$$$' type='number' label='Asking Price' />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput name='billingInfo' placeholder='4444-4444-4444-4444' type='text' label='Billing Info (Optional)' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput name='description' placeholder='Description' type='text' label='Description (Optional)' />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              {/* TODO: add the ability upload the images here */}
              <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button>
                  <Link style={{ color: 'white' }} to={ADMIN + DASHBOARD}>
                    Cancel
                  </Link>
                </Button>
                <Button type='submit' color='primary'>
                  Next
                </Button>
              </CardFooter>
            </FormikForm>
          </Card>
        </Col>
      )}
    </Formik>
  );
};

export default SneakerInfoForm;
