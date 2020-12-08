import React from "react";
import * as Yup from 'yup'
import { Formik, Form as FormikForm } from "formik";
import { FormGroup, Label, Row, Col, Button } from "reactstrap";

import FormikLabelSelect from "components/formik/FormikLabelSelect";
import FormikLabelInput from "components/formik/FormikLabelInput";

import { required, requiredPositiveNumber } from "utils/yup";

import { SneakerCondition } from "../../../../../shared";
import { months } from "data/date";

import _ from 'lodash'

export type PortfolioFormValues = {
  size: string;
  sneakerCondition: SneakerCondition;
  purchaseMonth: string;
  purchaseYear: string;
  purchasePrice: string;
};

const MIN_SNEAKER_SIZE = 3;

const INIT_PORTFOLIO_FORM_VALUES: PortfolioFormValues = {
  size: String(MIN_SNEAKER_SIZE),
  sneakerCondition: 'dead stock',
  purchaseMonth: '',
  purchaseYear: '',
  purchasePrice: '',
};

const portfolioFormValidations = Yup.object({
  purchaseMonth: required(),
  purchaseYear: required(),
  purchasePrice: requiredPositiveNumber('Purchase price'),
});

type PortfolioFormProps = {
  onSubmit: (values: PortfolioFormValues) => void;
  SearchResultChild: () => JSX.Element;
};

const PortfolioForm = (props: PortfolioFormProps) => {
  const { SearchResultChild } = props;

  return (
    <Formik
      initialValues={INIT_PORTFOLIO_FORM_VALUES}
      validationSchema={portfolioFormValidations}
      onSubmit={(formValues) => props.onSubmit(formValues)}
    >
      <FormikForm>
        <FormGroup style={{ padding: '20px' }}>
          <SearchResultChild />
        </FormGroup>
        <FormGroup>
          {/* TODO: the sizes need to be retrieved from th database, here is only a mock */}
          <FormikLabelSelect name='size' label='U.S Size' id='portfolio-sneaker-size'>
            {_.range(MIN_SNEAKER_SIZE, 16, 1).map((size) => (
              <option value={size} key={size}>
                {size}
              </option>
            ))}
          </FormikLabelSelect>
        </FormGroup>

        <FormGroup>
          <FormikLabelSelect name='sneakerCondition' label='Condition' id='portfolio-sneaker-condition'>
            <option value='dead stock'>Dead Stock</option>
            <option value='new'>New</option>
            <option value='used'>Used</option>
          </FormikLabelSelect>
        </FormGroup>

        <Label>Purchase Date</Label>

        <Row>
          <Col>
            <FormGroup>
              <FormikLabelSelect name='purchaseMonth' label='' id='portfolio-sneaker-purchase-month'>
                <option value=''>Month</option>
                {Object.keys(months).map((m) => (
                  <option value={m} key={m}>
                    {m}
                  </option>
                ))}
              </FormikLabelSelect>
            </FormGroup>
          </Col>

          <Col>
            <FormGroup>
              <FormikLabelSelect name='purchaseYear' label='' id='portfolio-sneaker-purchase-year'>
                <option value=''>Year</option>
                {_.range(new Date().getFullYear(), 1985, -1).map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </FormikLabelSelect>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <FormikLabelInput
            style={{ width: '135px' }}
            name='purchasePrice'
            placeholder='$$ ~ $$$$$'
            type='number'
            label='Purchase Price'
          />
        </FormGroup>
        <Button type='submit' color='primary'>
          Submit
        </Button>
      </FormikForm>
    </Formik>
  );
};

export default PortfolioForm
