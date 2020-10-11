import React from 'react';

import { Formik, Form as FormikForm } from 'formik';

import { FormGroup, Row, Col } from 'reactstrap';

import FormikLabelInput from './formik/FormikLabelInput';
import FormikAutoSuggestInput from './formik/FormikAutoSuggestInput';

type Address = {
  street: string;
  city: string;
  region: string;
  zipcode: number;
  country: string;
};

type AddressVerificationFormProps = {
  values: Address;
};

const regions = [
  'Northland',
  'Auckland',
  'Waikato',
  'Bay of Plenty',
  'Gisborn',
  "Hawke's Bay",
  'Taranaki',
  'Whanganui',
  'Wellington',
  'Marlborough',
  'Nelson',
  'West Coast',
  'Canterbury',
  'Otago',
  'Southland',
];

const cities = [
  'Auckland',
  'Whangarei',
  'Hamilton',
  'Tauranga',
  'Rotorua',
  'Gisborne',
  'Napier',
  'New Plymouth',
  'Palmerston North',
  'Wellington',
  'Nelson',
  'Greymouth',
  'Christchurch',
  'Dunedin',
  'Queenstown',
  'Invercargill',
];

const AddressVerificationForm = (props: AddressVerificationFormProps) => {
  return (
    <Formik initialValues={props.values} enableReinitialize onSubmit={() => {}}>
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
  );
};

export default AddressVerificationForm;
