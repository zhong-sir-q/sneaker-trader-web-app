import React, { useState } from 'react';

import { Col, Container, Progress } from 'reactstrap';

import PanelHeader from 'components/PanelHeader';
import SubmissionSuccess from 'components/SubmissionSuccess';
import PreviewSneaker from 'components/PreviewSneaker';
import SneakerInfoForm from 'components/SneakerInfoForm';

import {
  createProduct,
  uploadS3MultipleImages,
  fetchUserByEmail,
  createListedProduct,
  createBrand,
  createSneakerName,
  createColorway,
} from 'api/api';

import { Sneaker, ListedProduct } from '../../../shared';

import PreviewImagesDropZone, { PreviewFile } from 'components/PreviewImagesDropZone';
import { fetchCognitoUser } from 'utils/auth';

export type ListingFormSneakerStateType = Omit<Sneaker, 'imageUrls'>;

const INIT_SNEAKER_STATE: ListingFormSneakerStateType = {
  name: '',
  brand: '',
  size: '',
  colorway: '',
  price: '',
  description: '',
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

  const updateFileId = (fileId: string) => setMainFileId(fileId);

  const getMainDisplayFile = () => files.filter((f) => f.id === mainFileId)[0];

  const formDataFromFiles = () => {
    const formData = new FormData();

    for (const f of files) formData.append('files', f);

    return formData;
  };

  const formatListedProduct = (
    askingPrice: number,
    userId: number,
    productId: number,
    quantity?: number
  ): ListedProduct => ({
    userId,
    productId,
    askingPrice,
    // default quantity. Enable the user to select the
    // quantity of shoes they want to sell in the future
    quantity: quantity || 1,
    sold: 0,
  });

  // steps:
  // upload all the images to S3 -> insert the product in the
  // Products and the ListedProducts table -> display successful message
  const onFinishSubmit = async () => {
    const uploadedUrls = await uploadS3MultipleImages(formDataFromFiles()).catch((err) => console.log(err));
    // handle upload error
    if (!uploadedUrls) return;

    const formattedUrls = uploadedUrls.join(',');
    const createSneakerPayload = { ...sneaker, imageUrls: formattedUrls };

    const productId = await createProduct(createSneakerPayload).catch((err) => console.log(err));

    // handle db create product error
    if (!productId) return;

    const cognitoUser = await fetchCognitoUser().catch((err) => console.log(err));
    // handle error
    if (!cognitoUser) return;

    const user = await fetchUserByEmail(cognitoUser.email).catch((err) => console.log(err));
    // handle error
    if (!user) return;

    const listedProductPayload = formatListedProduct(sneaker.price! as number, user.id!, productId);
    await createListedProduct(listedProductPayload);

    // duplicate primary key insertions are handled by the backend
    await createBrand({ brand: sneaker.brand });
    await createColorway({ colorway: sneaker.colorway });
    await createSneakerName({ name: sneaker.name });

    // Go to the success message
    onNextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SneakerInfoForm formValues={{ ...sneaker, billingInfo }} onSubmit={onSubmitForm} />;
      case 1:
        return (
          <PreviewImagesDropZone
            {...{ files, mainFileId, onPrevStep, onNextStep, onDropFile, onRemoveFile, updateFileId }}
          />
        );
      case 2:
        const previewSneaker = { ...sneaker, imageUrls: getMainDisplayFile().preview };
        return <PreviewSneaker {...{ sneaker: previewSneaker, onPrevStep, onSubmit: onFinishSubmit }} />;
      case 3:
        return <SubmissionSuccess />;
      default:
        return undefined;
    }
  };

  const calcProgress = () => ((step + 1) / 4) * 100;

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content' style={{ paddingTop: '2.2rem' }}>
        <Container style={{ maxWidth: step === 2 ? '500px' : undefined }}>
          <Col className='text-center'>
            <p style={{ margin: 0 }}>{calcProgress()}%</p>
            <div style={{ marginBottom: '1rem' }}>
              <Progress value={calcProgress()} />
            </div>
            {renderStep()}
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListingForm;
