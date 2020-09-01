import React, { useState } from 'react';

import { Col, Container } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SubmissionSuccess from 'components/SubmissionSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';

import { createProduct, uploadS3MultipleImages } from 'api/api';

import { Sneaker } from '../../../shared';

import PreviewImagesDropZone from 'components/PreviewImagesDropZone';

export type ListingFormSneakerStateType = Omit<Sneaker, 'imageUrls'>;

const INIT_SNEAKER_STATE: ListingFormSneakerStateType = {
  name: '',
  brand: '',
  size: undefined,
  colorWay: '',
  price: undefined,
  description: '',
};

// NOTE: the type is defined in  PreviewImageDropZone, too
type PreviewFile = File & {
  preview: string;
  id: string;
};

// A 4-step form, first to submit the basic info, second to preview with the
// option to go back and change, third to confirm and upload the product. Lastly
// prompt the success message to the user

const ProductListingForm = () => {
  const [sneaker, setSneaker] = useState(INIT_SNEAKER_STATE);
  // not part of the sneaker, so separate the state out
  const [billingInfo, setBillingInfo] = useState('');
  // images
  const [files, setFiles] = useState<PreviewFile[]>([]);
  // use this as the specific ID of the file
  const [mainFileId, setMainFileId] = useState<string>();

  const [step, setStep] = useState(0);

  // TODO: where is a good place to revoke the urls while maintaing a good UX
  // i.e. the user can still see the images when they reverse the step
  // useEffect(
  //   () => () => {
  //     // Make sure to revoke the data uris to avoid memory leaks
  //     files.forEach((file) => URL.revokeObjectURL(file.preview));
  //   },
  //   [files]
  // );

  const onPrevStep = () => setStep(step - 1);

  const onNextStep = () => setStep(step + 1);

  const onSubmitForm = (sneakerStates: ListingFormSneakerStateType, billingInfoInput: string) => {
    onNextStep();

    setSneaker(sneakerStates);
    setBillingInfo(billingInfoInput);
  };

  const onDropFile = (newFiles: PreviewFile[]) => setFiles(newFiles);

  const onRemoveFile = (fileId: string) => {
    if (mainFileId === fileId) setMainFileId(undefined);

    const filesAfterRemoval = files.filter((file) => file.id !== fileId);
    setFiles(filesAfterRemoval);
  };

  const onClickImage = (fileId: string) => setMainFileId(fileId);

  const getMainDisplayFile = () => files.filter((f) => f.id === mainFileId)[0];

  const formDataFromFiles = () => {
    const formData = new FormData();

    for (const f of files) formData.append('files', f);

    return formData;
  };

  // TODO: add loading animation while uploading the files
  // steps: upload all the images to S3 -> create the product in the
  // backend -> display successful message
  const onFinishSubmit = async () => {
    const uploadedUrls = await uploadS3MultipleImages(formDataFromFiles()).catch((err) => console.log(err));
    if (!uploadedUrls) return;

    const formattedUrls = uploadedUrls.join(',');
    const createSneakerPayload = { ...sneaker, imageUrls: formattedUrls };

    const product = await createProduct(createSneakerPayload).catch((err) => console.log(err));

    // handle db create product error
    if (!product) return;

    // Go to the success message
    onNextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm formValues={{ ...sneaker, billingInfo }} onSubmit={onSubmitForm} />;
      case 1:
        return <PreviewImagesDropZone {...{ files, mainFileId, onPrevStep, onNextStep, onDropFile, onRemoveFile, onClickImage }} />;
      case 2:
        const previewSneaker = { ...sneaker, imageUrls: getMainDisplayFile().preview };
        return <PreviewSneaker {...{ sneaker: previewSneaker, onPrevStep, onSubmit: onFinishSubmit }} />;
      case 3:
        return <SubmissionSuccess />;
      default:
        return undefined;
    }
  };

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Container>
          <Col className='text-center'>{renderStep()}</Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListingForm;
