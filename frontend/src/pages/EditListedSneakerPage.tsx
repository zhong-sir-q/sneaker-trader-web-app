import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import SneakerListingFormProvider, { useSneakerListingFormCtx } from 'providers/SneakerListingFormProvider';
import PreviewImgDropzoneProvider, { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import { createPreviewFileFromBlob } from 'utils/utils';
import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

import SneakerInfoForm from 'components/SneakerInfoForm';
import PanelHeader from 'components/PanelHeader';
import CenterSpinner from 'components/CenterSpinner';
import PreviewSneaker from 'components/PreviewSneaker';
import PreviewImagesDropzone, { PreviewFile } from 'components/PreviewImagesDropzone';

import { SellerListedSneaker } from '../../../shared';
import { Container } from 'reactstrap';

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
        const blob = await fetch(
          formatApiEndpoint(concatPaths('proxy', 'blob')),
          formatRequestOptions({ url })
        ).then((r) => r.blob());

        console.log(blob);

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
        <EditListedSneakerPage />
      </PreviewImgDropzoneProvider>
    </SneakerListingFormProvider>
  );
};

const EditListedSneakerPage: React.FC = () => {
  const { getMainDisplayFile } = usePreviewImgDropzoneCtx();
  const { listingSneakerFormState } = useSneakerListingFormCtx();

  const mainDisplayFile = getMainDisplayFile();

  return (
    <React.Fragment>
      <PanelHeader size='sm' />
      <div className='content'>
        <Container fluid='md'>
          <SneakerInfoForm title='Edit Sneaker Form' />
          <PreviewImagesDropzone />
          {mainDisplayFile && (
            <PreviewSneaker
              aspectRatio='66.6%'
              sneaker={listingSneakerFormState as SellerListedSneaker}
              mainDisplayImage={mainDisplayFile.preview}
              price={Number(listingSneakerFormState.askingPrice)}
              onSubmit={() => {}}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditListedSneakerPageContainer;
