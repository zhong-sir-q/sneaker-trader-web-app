import React, { useEffect } from 'react';

import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from 'reactstrap';

import { Formik, Form as FormikForm, useFormikContext } from 'formik';

import _ from 'lodash';

import FormikLabelInput from './formik/FormikLabelInput';
import FormikLabelSelect from './formik/FormikLabelSelect';
import FormikAutoSuggestInput from './formik/FormikAutoSuggestInput';

import { useSneakerListingFormCtx, SneakerListingFormStateType } from 'providers/SneakerListingFormProvider';
import { trimValues } from 'utils/utils';

type SneakerInfoFormProps = {
  title: string;
  goNextStep?: () => void;
  goPrevStep?: () => void;
};

const currencyCodeOptions = ['NZD', 'USD', 'AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'JPY', 'YUAN'];
const shoeSizeOptions = ['US', 'EU', 'Japan', 'UK'];
const sneakerConditionRatings = _.range(1, 10, 0.5);

// sync the formik form values with the snekaer listing form provider values
const FormikValueSubscriber = () => {
  const { values } = useFormikContext();
  const { updateFormState } = useSneakerListingFormCtx();

  useEffect(() => {
    updateFormState(values as SneakerListingFormStateType);
  }, [values, updateFormState]);

  return null;
};

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
    updateFormState,
  } = useSneakerListingFormCtx();

  return (
    <Formik
      initialValues={listingSneakerFormState}
      validationSchema={validationSchema}
      onSubmit={(formStates) => {
        updateFormState(trimValues(formStates) as SneakerListingFormStateType);
        if (props.goNextStep) props.goNextStep();
      }}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Card className='text-left'>
          <FormikValueSubscriber />
          <CardHeader>
            <h5 className='text-center title'>{props.title}</h5>
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
                      data-testid='name-input'
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
                      data-testid='brand-input'
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
                      data-testid='colorway-input'
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <FormGroup>
                    <FormikLabelSelect
                      name='sizeSystem'
                      label='Size System'
                      id='sneaker-size-system'
                      data-testid='size-sys-select-input'
                    >
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
                    <FormikLabelInput
                      name='size'
                      placeholder='Size'
                      type='number'
                      label='Shoe Size'
                      data-testid='size-input'
                    />
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

              <Row>
                <Col md='4'>
                  <FormGroup>
                    <FormikLabelInput
                      name='originalPurchasePrice'
                      placeholder='$$ ~ $$$$$'
                      type='number'
                      label='Purchase Price'
                      data-testid='price-input'
                    />
                  </FormGroup>
                </Col>

                <Col md='4'>
                  <FormGroup>
                    <FormikLabelInput
                      name='askingPrice'
                      placeholder='$$ ~ $$$$$'
                      type='number'
                      label='Asking Price'
                      data-testid='asking-price-input'
                    />
                  </FormGroup>
                </Col>

                <Col md='4'>
                  <FormGroup>
                    <FormikLabelSelect
                      name='currencyCode'
                      label='Price Currency Code'
                      id='sneaker-price-currency'
                      data-testid='currency-input'
                    >
                      {currencyCodeOptions.map((cOpt, idx) => (
                        <option key={idx} value={cOpt}>
                          {cOpt}
                        </option>
                      ))}
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
                <FormikLabelInput
                  name='description'
                  placeholder='Description...'
                  type='textarea'
                  label='Description (Optional)'
                />
              </FormGroup>
            </CardBody>
            {props.goNextStep && props.goPrevStep && (
              <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button type='button' onClick={props.goPrevStep}>
                  Back
                </Button>
                <Button type='submit' color='primary' data-testid='sneaker-info-form-submit-btn'>
                  Next
                </Button>
              </CardFooter>
            )}
          </FormikForm>
        </Card>
      )}
    </Formik>
  );
};

export default SneakerInfoForm;
