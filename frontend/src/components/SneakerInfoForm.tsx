import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';
import { required, requiredPositiveNumber } from 'utils/yup';

import { useDropzone, DropzoneState } from 'react-dropzone';
import { Col, Card, CardHeader, CardBody, Row, FormGroup, CardFooter, Button } from 'reactstrap';
import FormikLabelInput from './formik/FormikLabelInput';

import { Sneaker } from '../../../shared';

import styled from 'styled-components';

const getColor = (props: DropzoneState) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const DropZoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props: any) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const PreviewAside = styled.aside`
  display: flex;
`;

const Thumb = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2;
  border: '1px solid #eaeaea';
  margin-bottom: 8;
  margin-right: 8;
  padding: 4;
`;

interface PreviewFile extends File {
  preview: string;
}

// TODO: set a max limit of 5 files; Add ability for the user to choose the main photo, it will be after clicking on the image
const PreviewDropZone = () => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => setFiles(files.concat(acceptedFiles.map((file: any) => ({ ...file, preview: URL.createObjectURL(file) })))),
  });

  const removeImage = (imgIdx: number) => setFiles(files.filter((_file, idx) => idx !== imgIdx))

  const thumbs = files.map((file, idx) => (
    <Thumb key={idx}>
      <img src={file.preview} alt={file.name} />
      {/* TODO: replace this with a cross or a bin icon */}
      <i onClick={() => removeImage(idx)} className='now-ui-icons design_bullet-list-67' />
    </Thumb>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section>
      <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <span>Drag 'n' drop some files here, or click to select files</span>
      </DropZoneContainer>
      <PreviewAside>{thumbs}</PreviewAside>
    </section>
  );
};

type SneakerInfoFormStateType = Sneaker & { billingInfo: string };

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
              <Row>
                <Col md='12'>
                  <PreviewDropZone />
                  {/* <StyledDropzone /> */}
                </Col>
              </Row>
            </CardBody>
            {/* TODO: add the ability upload the images here */}
            <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button disabled>Previous</Button>
              <Button type='submit' color='primary'>
                Preview
              </Button>
            </CardFooter>
          </FormikForm>
        </Card>
      </Col>
    </Formik>
  );
};

export default SneakerInfoForm;
