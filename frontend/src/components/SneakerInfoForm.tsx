import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from 'reactstrap';

import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';

import { ListingFormSneakerStateType } from 'pages/ProductListingForm';
import FormikAutoSuggestInput from './formik/FormikAutoSuggestInput';
import FormikLabelInput from './formik/FormikLabelInput';

import { DASHBOARD, ADMIN } from 'routes';

import { required, requiredPositiveNumber } from 'utils/yup';
import { getBrands, getSneakerNames, getColorways } from 'api/api';
import FormikLabelSelect from './formik/FormikLabelSelect';

type SneakerInfoFormStateType = ListingFormSneakerStateType & { billingInfo: string };

type SneakerInfoFormProps = {
  formValues: SneakerInfoFormStateType;
  onSubmit: (sneaker: ListingFormSneakerStateType, billingInfo: string) => void;
};

const sneakerInfoValidation = Yup.object({
  name: required(),
  brand: required(),
  colorway: required(),
  currencyCode: required(),
  sizeSystem: required(),
  prodCondition: required(),
  // TODO: should be a price limit, confirm with Aaron
  askingPrice: requiredPositiveNumber('Price'),
  // NOTE: should be between size 1 to 15 or something
  size: requiredPositiveNumber('Size'),
});

const currencyCodeOptions = ['AUD', 'YUAN', 'NZD', 'USD', 'CAD', 'EUR', 'GBP', 'CHF', 'JPY'];
const shoeSizeOptions = ['US', 'EU', 'UK', 'Japan']

const SneakerInfoForm = (props: SneakerInfoFormProps) => {
  const preventOnFormEnterDefault = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if ((evt.charCode || evt.keyCode) === 13) evt.preventDefault();
  };

  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [sneakerNamesOptions, setSneakerNamesOptions] = useState<string[]>([]);
  const [colorwayOptions, setColorwayOptions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setBrandOptions((await getBrands()).map((b) => b.brand));
      setSneakerNamesOptions((await getSneakerNames()).map((sn) => sn.name));
      setColorwayOptions((await getColorways()).map((c) => c.colorway));
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
      {({ setFieldValue }) => (
        <Card className='text-left'>
          <CardHeader>
            <h5 className='text-center title'>Sneaker Listing Form</h5>
          </CardHeader>
          <FormikForm onKeyDown={preventOnFormEnterDefault}>
            <CardBody>
              <Row>
                <Col md='4'>
                  <FormGroup>
                    <FormikAutoSuggestInput
                      name='name'
                      label='Name'
                      options={sneakerNamesOptions}
                      setfieldvalue={setFieldValue}
                    />
                  </FormGroup>
                </Col>
                <Col md='4'>
                  <FormGroup>
                    <FormikAutoSuggestInput
                      name='brand'
                      label='Brand'
                      options={brandOptions}
                      setfieldvalue={setFieldValue}
                    />
                  </FormGroup>
                </Col>
                <Col md='4'>
                  <FormGroup>
                    <FormikLabelInput name='size' placeholder='Size' type='number' label='Shoe Size' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <FormGroup>
                    <FormikAutoSuggestInput
                      name='colorway'
                      label='Color Way'
                      options={colorwayOptions}
                      setfieldvalue={setFieldValue}
                    />
                  </FormGroup>
                </Col>
                <Col md='4'>
                  <FormGroup>
                    <FormikLabelInput name='askingPrice' placeholder='$$ ~ $$$$$' type='number' label='Asking Price' />
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
                    <FormikLabelSelect name='sizeSystem' label='Size System' id='sneaker-size-system'>
                      <option value=''>None</option>
                      {shoeSizeOptions.map((sOpt, idx) => <option value={sOpt} key={idx}>{sOpt}</option>)}
                    </FormikLabelSelect>
                  </FormGroup>
                </Col>

                <Col md='4'>
                  <FormGroup>
                    <FormikLabelSelect name='currencyCode' label='Price Currency Code' id='sneaker-price-currency'>
                      <option value=''>None</option>
                      {currencyCodeOptions.map((cOpt, idx) => (
                        <option key={idx} value={cOpt}>{cOpt}</option>
                      ))}
                    </FormikLabelSelect>
                  </FormGroup>
                </Col>

                <Col md='4'>
                  <FormGroup>
                    <FormikLabelSelect name='prodCondition' label='Condition' id='sneaker-prodCondition'>
                      <option value=''>None</option>
                      <option value='dead stock'>Dead Stock</option>
                      <option value='new'>New</option>
                      <option value='used'>Used</option>
                    </FormikLabelSelect>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                {/* TODO: add new line after enter is pressed */}
                <FormikLabelInput
                  name='description'
                  placeholder='Description...'
                  type='textarea'
                  label='Description (Optional)'
                />
              </FormGroup>
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
      )}
    </Formik>
  );
};

export default SneakerInfoForm;
