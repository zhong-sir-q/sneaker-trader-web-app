import React from 'react';
import { Link } from 'react-router-dom';

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from 'reactstrap';

import { Formik, Form as FormikForm } from 'formik';

import FormikLabelInput from './formik/FormikLabelInput';
import FormikLabelSelect from './formik/FormikLabelSelect';
import FormikAutoSuggestInput from './formik/FormikAutoSuggestInput';

import { DASHBOARD, ADMIN } from 'routes';

import { useSneakerListingFormCtx } from 'providers/SneakerListingFormCtxProvider';

type SneakerInfoFormProps = {
  goNextStep: () => void;
};

const range = (start: number, end: number, step: number): number[] => {
  let result: number[] = [];

  for (let num = start; num <= end; num += step) result.push(num);

  return result;
};

const currencyCodeOptions = ['AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'JPY', 'NZD', 'USD', 'YUAN'];
const shoeSizeOptions = ['EU', 'Japan', 'UK', 'US'];
const sneakerConditionRatings = range(1, 10, 0.5);

const SneakerInfoForm = (props: SneakerInfoFormProps) => {
  const preventOnFormEnterDefault = (evt: React.KeyboardEvent<HTMLFormElement>) => {
    if ((evt.charCode || evt.keyCode) === 13) evt.preventDefault();
  };

  const {
    brandOptions,
    colorwayOptions,
    sneakerNamesOptions,
    listingSneakerFormState,
    validationSchema,
    onSubmit,
  } = useSneakerListingFormCtx();

  return (
    <Formik
      initialValues={listingSneakerFormState}
      validationSchema={validationSchema}
      onSubmit={(formStates) => {
        onSubmit(formStates);
        props.goNextStep();
      }}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
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
                    <FormikAutoSuggestInput
                      name='colorway'
                      label='Color Way'
                      options={colorwayOptions}
                      setfieldvalue={setFieldValue}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <FormGroup>
                    <FormikLabelSelect name='sizeSystem' label='Size System' id='sneaker-size-system'>
                      <option value=''>None</option>
                      {shoeSizeOptions.map((sOpt, idx) => (
                        <option value={sOpt} key={idx}>
                          {sOpt}
                        </option>
                      ))}
                    </FormikLabelSelect>
                  </FormGroup>
                </Col>

                <Col md='4'>
                  <FormGroup>
                    <FormikLabelInput name='size' placeholder='Size' type='number' label='Shoe Size' />
                  </FormGroup>
                </Col>

                <Col md='4'>
                  <FormGroup>
                    <FormikLabelSelect name='currencyCode' label='Price Currency Code' id='sneaker-price-currency'>
                      <option value=''>None</option>
                      {currencyCodeOptions.map((cOpt, idx) => (
                        <option key={idx} value={cOpt}>
                          {cOpt}
                        </option>
                      ))}
                    </FormikLabelSelect>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md='4'>
                  <FormGroup>
                    <FormikLabelInput name='askingPrice' placeholder='$$ ~ $$$$$' type='number' label='Asking Price' />
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
              {values.prodCondition === 'used' && (
                <Row>
                  <Col md='4'>
                    <FormGroup>
                      <FormikLabelSelect
                        name='conditionRating'
                        label='Condition Rating'
                        id='sneaker-prodConditionRating'
                      >
                        {sneakerConditionRatings.map((val, idx) => (
                          <option key={idx} value={val}>
                            {val}
                          </option>
                        ))}
                      </FormikLabelSelect>
                    </FormGroup>
                  </Col>
                </Row>
              )}
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
              <Link style={{ color: 'white' }} to={ADMIN + DASHBOARD}>
                <Button type='button'>Cancel</Button>
              </Link>
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
