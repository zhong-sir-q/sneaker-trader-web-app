import React from 'react'
import * as Yup from 'yup'
import { Formik, Form as FormikForm } from "formik";
import { required, requiredPositiveNumber } from "utils/yup";

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from "reactstrap";
import FormikLabelInput from "./formik/FormikLabelInput";

import { Sneaker } from "../../../shared";

type SneakerInfoFormStateType = Sneaker & { billingInfo: string };

// TODO: put the below 2 components in the components folder
type SneakerInfoFormProps = {
  formValues: SneakerInfoFormStateType;
  onSubmit: (sneaker: Sneaker, billingInfo: string) => void;
};

const sneakerInfoValidation = Yup.object({
  name: required(),
  brand: required(),
  colorWay: required(),
  // TODO: should be a price limit, confirm with Aaron
  price: requiredPositiveNumber('Price'),
  // NOTE: should be between size 1 to 15 or something
  size: requiredPositiveNumber('Size'),
  // NEED TO ADD IMAGE_URL HERE
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
      <Col md='12'>
        <Card className='text-left'>
          <CardHeader>
            <h5 className='text-center title'>Sneaker Listing Form</h5>
          </CardHeader>
          <CardBody>
            <FormikForm>
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
              {/* TODO: add the ability upload the images here */}
              <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button disabled>Previous</Button>
                <Button type='submit' color='primary'>
                  Preview
                </Button>
              </CardFooter>
            </FormikForm>
          </CardBody>
        </Card>
      </Col>
    </Formik>
  );
};

export default SneakerInfoForm
