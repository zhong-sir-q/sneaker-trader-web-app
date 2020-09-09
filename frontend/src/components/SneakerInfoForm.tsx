import React from 'react';
import { Link } from 'react-router-dom';

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button, Form } from 'reactstrap';

import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';
import { required, requiredPositiveNumber } from 'utils/yup';

import FormikLabelInput from './formik/FormikLabelInput';

import { DASHBOARD, ADMIN } from 'routes';
import { ListingFormSneakerStateType } from 'pages/ProductListingForm';
import AutoSuggestInput from './AutoSuggestInput';

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

const mockBrands = ['Nike', 'Adidas', 'Air Jordan', 'Anta', 'Puma'];
const mockShoeNames = [
  'Kobe 14 Black',
  'AJ 1 Retro Red and White',
  'kd 9 elite Black',
  'Stephen Curry 4 White and black',
];
const mockColorways = ['Black', 'Red and White', 'White and Black']

// TODO: disable submit form on enter
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
      {() => (
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
                      <AutoSuggestInput label='Name' options={mockShoeNames} />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <AutoSuggestInput label='Brand' options={mockBrands} />
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
                      <AutoSuggestInput label='Color Way' options={mockColorways} />
                      {/* <FormikLabelInput name='colorWay' placeholder='Color Way' type='text' label='Color Way' /> */}
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput name='price' placeholder='$$ ~ $$$$$' type='number' label='Asking Price' />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput
                        name='billingInfo'
                        placeholder='4444-4444-4444-4444'
                        type='text'
                        label='Billing Info (Optional)'
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelInput
                        name='description'
                        placeholder='Description'
                        type='text'
                        label='Description (Optional)'
                      />
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
