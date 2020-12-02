import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import SneakerListingFormProvider, { useSneakerListingFormCtx, SneakerListingFormStateType } from 'providers/SneakerListingFormProvider';
import PreviewImgDropzoneProvider, { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import {
  createPreviewFileFromBlob,
  formatListedSneakerPayload,
  getListedSneakerIdFromPath,
  formatSneaker,
  trimValues,
} from 'utils/utils';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';

import SneakerInfoForm from 'components/SneakerInfoForm';
import PanelHeader from 'components/PanelHeader';
import CenterSpinner from 'components/CenterSpinner';
import PreviewSneaker from 'components/PreviewSneaker';
import PreviewImagesDropzone, { PreviewFile } from 'components/PreviewImagesDropzone';

import { SellerListedSneaker } from '../../../shared';
import { Container, Button } from 'reactstrap';
import { useAuth } from 'providers/AuthProvider';
import onEditListedSneaker from 'usecases/onEditListedSneaker';
import AwsControllerInstance from 'api/controllers/AwsController';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import AlertDialog from 'components/AlertDialog';
import { ADMIN, DASHBOARD } from 'routes';
import { Dialog, DialogContent, DialogActions } from '@material-ui/core';

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

  const [confirmMakeNewRequest, setConfirmMakeNewRequest] = useState(false);
  const confirmationDialogHook = useOpenCloseComp();
  const newRequestDialogHook = useOpenCloseComp();

  const history = useHistory();
  const { currentUser } = useAuth();

  const updateSuccessAlertHook = useOpenCloseComp();

  useEffect(() => {
    // listen to this state, if true, then change the current status of the sneaker
    if (confirmMakeNewRequest) {
      (async () => {
        setConfirmMakeNewRequest(false);
        const imgFormData = formDataFromFiles();

        const sanitizedStateValues = trimValues(listingSneakerFormState) as SneakerListingFormStateType

        await onEditListedSneaker(
          AwsControllerInstance,
          SneakerControllerInstance,
          ListedSneakerControllerInstance,
          HelperInfoControllerInstance
        )(
          props.listedSneakerId,
          imgFormData,
          currentUser!.id,
          formatSneaker(sanitizedStateValues),
          undefined,
          undefined,
          undefined,
          formatListedSneakerPayload(sanitizedStateValues, 'new sneaker request')
        );

        newRequestDialogHook.onOpen();
        setTimeout(() => history.push(ADMIN + DASHBOARD), 1500);
      })();
    }
  });

  const onConfirmUpdate = async () => {
    // prepare the payload
    const imgFormData = formDataFromFiles();

    const sanitizedStateValues = trimValues(listingSneakerFormState) as SneakerListingFormStateType

    const sneaker = await SneakerControllerInstance.getFirstByNameColorway(
      sanitizedStateValues.name,
      sanitizedStateValues.colorway
    );

    // sneaker is not in the db, ask the user if they want to make a new request
    if (!sneaker) {
      confirmationDialogHook.onOpen();
      return;
    }

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
      formatSneaker(sanitizedStateValues),
      undefined,
      undefined,
      undefined,
      formatListedSneakerPayload(sanitizedStateValues)
    );

    updateSuccessAlertHook.onOpen();
    setTimeout(() => history.push(ADMIN + DASHBOARD), 1500);
  };

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Container fluid='sm' style={{ padding: '0 8%' }}>
          <SneakerInfoForm title='Edit Sneaker Form' />
          <PreviewImagesDropzone />
          {mainDisplayFileDataUrl && (
            <PreviewSneaker
              aspectRatio='66.6%'
              sneaker={listingSneakerFormState as SellerListedSneaker}
              mainDisplayImage={mainDisplayFileDataUrl}
              price={Number(listingSneakerFormState.askingPrice)}
              onSubmit={onConfirmUpdate}
            />
          )}
        </Container>
      </div>
      <AlertDialog
        open={updateSuccessAlertHook.open}
        color='success'
        message='Successful update!'
        onClose={updateSuccessAlertHook.onClose}
      />

      <AlertDialog
        open={newRequestDialogHook.open}
        color='primary'
        message='Thank you for making a new sneaker request, we will review it shortly!'
        onClose={newRequestDialogHook.onClose}
      />

      <Dialog open={confirmationDialogHook.open} onClose={confirmationDialogHook.onClose}>
        <DialogContent>Do you want to request a pair of new sneakers?</DialogContent>
        <DialogActions>
          <Button color='danger' onClick={() => setConfirmMakeNewRequest(true)}>
            Yes
          </Button>
          <Button onClick={confirmationDialogHook.onClose}>No</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default EditListedSneakerPageContainer;
