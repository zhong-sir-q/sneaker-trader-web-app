import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import SneakerListingFormProvider, { useSneakerListingFormCtx } from 'providers/SneakerListingFormProvider';
import PreviewImgDropzoneProvider, { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import { createPreviewFileFromBlob, formatListedSneakerPayload, getListedSneakerIdFromPath } from 'utils/utils';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';

import SneakerInfoForm from 'components/SneakerInfoForm';
import PanelHeader from 'components/PanelHeader';
import CenterSpinner from 'components/CenterSpinner';
import PreviewSneaker from 'components/PreviewSneaker';
import PreviewImagesDropzone, { PreviewFile } from 'components/PreviewImagesDropzone';

import { SellerListedSneaker } from '../../../shared';
import { Container } from 'reactstrap';
import { useAuth } from 'providers/AuthProvider';
import onEditListedSneaker from 'usecases/onEditListedSneaker';
import AwsControllerInstance from 'api/controllers/AwsController';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import AlertDialog from 'components/AlertDialog';
import { ADMIN, DASHBOARD } from 'routes';

// get the history state from listed sneaker table
const EditListedSneakerPageContainer = () => {
  const history = useHistory();
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>();

  const listedSneaker = history.location.state as SellerListedSneaker;
  const { imageUrls } = listedSneaker;

  useEffect(() => {
    (async () => {
      const files: PreviewFile[] = [];
      for (const url of imageUrls.split(',')) {
        const parts = url.split('/');
        const imgId = parts[parts.length - 1];
        const blob = await fetch(formatApiEndpoint(concatPaths('aws', 'image', imgId))).then((r) => r.blob());

        const previewFile = createPreviewFileFromBlob(blob);
        files.push(previewFile);
      }

      setPreviewFiles(files);
    })();
  }, [imageUrls]);

  return !previewFiles ? (
    <CenterSpinner />
  ) : (
    <SneakerListingFormProvider formValues={listedSneaker}>
      <PreviewImgDropzoneProvider previewFiles={previewFiles}>
        <EditListedSneakerPage listedSneakerId={getListedSneakerIdFromPath(history.location.pathname)} />
      </PreviewImgDropzoneProvider>
    </SneakerListingFormProvider>
  );
};

type EditListedSneakerPageProps = {
  listedSneakerId: number;
};

const EditListedSneakerPage = (props: EditListedSneakerPageProps) => {
  const { mainDisplayFileDataUrl, formDataFromFiles } = usePreviewImgDropzoneCtx();
  const { listingSneakerFormState } = useSneakerListingFormCtx();
  const { currentUser } = useAuth();

  const history = useHistory();

  const updateSuccessAlertHook = useOpenCloseComp();

  const onConfirmUpdate = async () => {
    // prepare the payload
    const imgFormData = formDataFromFiles();

    // check if the product already exists in the db
    // if yes, finish editing, otherwise, ask them to make a new request (would it be a new reueqst if only the size changes?)
    const sneaker = await SneakerControllerInstance.getFirstByNameColorway(
      listingSneakerFormState.name,
      listingSneakerFormState.colorway
    );

    // a new request? or cancel the current edit
    if (!sneaker) return

    // TODO: the helperInfo such as brand, name and colorway can be updated, and we need to give updates on our side
    await onEditListedSneaker(
      AwsControllerInstance,
      SneakerControllerInstance,
      ListedSneakerControllerInstance,
      HelperInfoControllerInstance
    )(
      props.listedSneakerId,
      imgFormData,
      currentUser!.id,
      listingSneakerFormState as any,
      undefined,
      undefined,
      undefined,
      formatListedSneakerPayload(listingSneakerFormState)
    );

    updateSuccessAlertHook.onOpen();
    setTimeout(() => history.push(ADMIN + DASHBOARD), 1000);
  };

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Container fluid='sm' style={{ padding: '0 8%' }}>
          <SneakerInfoForm title='Edit Sneaker Form' />
          <PreviewImagesDropzone />
          <PreviewSneaker
            aspectRatio='66.6%'
            sneaker={listingSneakerFormState as SellerListedSneaker}
            mainDisplayImage={mainDisplayFileDataUrl}
            price={Number(listingSneakerFormState.askingPrice)}
            onSubmit={onConfirmUpdate}
          />
        </Container>
      </div>
      <AlertDialog
        open={updateSuccessAlertHook.open}
        color='success'
        message='Successful update!'
        onClose={updateSuccessAlertHook.onClose}
      />
    </React.Fragment>
  );
};

export default EditListedSneakerPageContainer;
