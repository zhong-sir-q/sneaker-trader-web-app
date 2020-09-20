import React, { useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { DropzoneState, useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import { Button, Card, CardFooter, CardHeader, CardBody } from 'reactstrap';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneCtxProvider';

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
  padding: 20px;
  border: 2px dashed ${(props: any) => getColor(props)};
  background-color: #fafafa;
  color: #bdbdbd;
  transition: border 0.24s ease-in-out;
`;

const PreviewAside = styled.aside`
  display: flex;
`;

type ThumbProps = {
  isImageSelected: boolean;
  isFirstChild: boolean;
};

const Thumb = styled.div<ThumbProps>`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  border: 2.5px solid;
  margin-top: 10px;
  max-width: 185px;
  margin-left: ${({ isFirstChild }) => (isFirstChild ? 0 : '10px')};
  border-color: ${({ isImageSelected }) => (isImageSelected ? 'green' : '#eaeaea')};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  margin-bottom: 5px;
`;

const GreenDot = styled.span`
  height: 8px;
  width: 8px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  margin-right: 3px;
`;

export type PreviewFile = File & {
  preview: string;
  id: string;
};

type PreviewImagesDropZoneProps = {
  onPrevStep: () => void;
  onNextStep: (previewImgUrl: string, imgUrlsFormData: FormData) => void;
};

const PreviewImagesDropzone = (props: PreviewImagesDropZoneProps) => {
  const { onPrevStep, onNextStep } = props;
  const {
    files,
    mainFileId,
    formDataFromFiles,
    onDropFile,
    onRemoveFile,
    updateFileId,
    getMainDisplayFile,
  } = usePreviewImgDropzoneCtx();

  const thumbs = files.map((file, idx) => (
    <Thumb isImageSelected={mainFileId === file.id} isFirstChild={idx === 0} key={file.id}>
      <PreviewImage onClick={() => updateFileId(file.id)} src={file.preview} alt={file.name} />
      <i
        style={{ cursor: 'pointer' }}
        onClick={() => onRemoveFile(file.id)}
        className='now-ui-icons ui-1_simple-remove'
      />
    </Thumb>
  ));

  // set the first image to be the default main display
  useEffect(() => {
    if (!mainFileId && thumbs.length > 0) updateFileId(thumbs[0].key as string);
  }, [mainFileId, thumbs, updateFileId]);

  const UPLOAD_LIMIT = 5;
  const isFileUploadLimit = () => files.length === UPLOAD_LIMIT;

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      if (isFileUploadLimit()) {
        alert('Maximum upload of 5 images!');
        return;
      }

      const filesAfterAddition = files.concat(
        acceptedFiles.map((file: any) => {
          const previewBlob = URL.createObjectURL(file);
          return Object.assign(file, { preview: previewBlob, id: uuidV4() });
        })
      );

      onDropFile(filesAfterAddition);
    },
  });

  // TODO: where is a good place to revoke the urls while maintaing a good UX
  // i.e. the user can still see the images when they reverse the step
  // useEffect(
  //   () => () => {
  //     // Make sure to revoke the data uris to avoid memory leaks
  //     files.forEach((file) => URL.revokeObjectURL(file.preview));
  //   },
  //   [files]
  // );

  const onPreview = () => {
    // previewFile should always be defined, because the preview button is
    // disabled if there is no image and a main image is selected by default
    const previewFile = getMainDisplayFile();
    if (!previewFile) return;
    console.log(previewFile.preview)

    onNextStep(previewFile.preview, formDataFromFiles());
  };

  return (
    <Card style={{ padding: '15px 15px 0px 15px' }}>
      <CardHeader>
        <p>
          <GreenDot /> Main Display Image
        </p>
        <p className='category' style={{ fontSize: '0.95em' }}>
          Upload 5 images max
        </p>
      </CardHeader>

      <CardBody>
        <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
          <input {...getInputProps()} name='files' />
          <span>Select Images</span>
        </DropZoneContainer>

        <PreviewAside>{thumbs}</PreviewAside>
      </CardBody>

      <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={onPrevStep}>Previous</Button>
        <Button disabled={files.length === 0} color='primary' onClick={onPreview}>
          Preview
        </Button>
      </CardFooter>

    </Card>
  );
};

export default PreviewImagesDropzone;
