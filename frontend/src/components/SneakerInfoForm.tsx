import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from 'reactstrap';

import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';

import { ListingFormSneakerStateType } from 'pages/ProductListingForm';
import FormikAutoSuggestInput from './FormikAutoSuggestInput';
import FormikLabelInput from './formik/FormikLabelInput';

import { DASHBOARD, ADMIN } from 'routes';

import { required, requiredPositiveNumber } from 'utils/yup';
import { getBrands, getSneakerNames, getColorways } from 'api/api';

type SneakerInfoFormStateType = ListingFormSneakerStateType & { billingInfo: string };

type SneakerInfoFormProps = {
  formValues: SneakerInfoFormStateType;
  onSubmit: (sneaker: ListingFormSneakerStateType, billingInfo: string) => void;
};

const sneakerInfoValidation = Yup.object({
  name: required(),
  brand: required(),
  colorway: required(),
  // TODO: should be a price limit, confirm with Aaron
  price: requiredPositiveNumber('Price'),
  // NOTE: should be between size 1 to 15 or something
  size: requiredPositiveNumber('Size'),
});

const SneakerInfoForm = (props: SneakerInfoFormProps) => {
  const preventOnFormEnterDefault = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if ((evt.charCode || evt.keyCode) === 13) evt.preventDefault();
  };

  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [sneakerNamesOptions, setSneakerNamesOptions] = useState<string[]>([]);
  const [colorwayOptions, setColorwayOptions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setBrandOptions((await getBrands()).map(b => b.brand));
      setSneakerNamesOptions((await getSneakerNames()).map(sn => sn.name));
      setColorwayOptions((await getColorways()).map(c => c.colorway));
    })();
  }, []);

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
            <FormikForm onKeyDown={preventOnFormEnterDefault}>
              <CardBody>
                <Row>
                  <Col md='4'>
                    <FormGroup>
                      <FormikAutoSuggestInput name='name' label='Name' options={sneakerNamesOptions} />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <FormikAutoSuggestInput name='brand' label='Brand' options={brandOptions} />
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
                      <FormikAutoSuggestInput name='colorway' label='Color Way' options={colorwayOptions} />
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
