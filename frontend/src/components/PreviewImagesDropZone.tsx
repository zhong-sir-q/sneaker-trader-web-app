import React, { useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { DropzoneState, useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import { Button, Card, CardFooter, CardHeader, CardBody } from 'reactstrap';

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
  files: PreviewFile[];
  mainFileId: string | undefined;
  onPrevStep: () => void;
  onNextStep: () => void;
  onDropFile: (newFiles: PreviewFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  updateFileId: (fileId: string) => void;
};

const PreviewImagesDropZone = (props: PreviewImagesDropZoneProps) => {
  const { files, mainFileId, onPrevStep, onNextStep, onDropFile, onRemoveFile, updateFileId } = props;

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

  // reject user if the main image has not be selected yet
  const onPreview = () => {
    if (!mainFileId) {
      alert('Select a main image to display');
      return;
    }

    onNextStep();
  };

  return (
    <Card style={{ padding: '15px 15px 0px 15px' }}>
      <CardHeader>
        <p>
          <GreenDot /> Click the image to select the main display image
        </p>
        <p className='category' style={{ fontSize: '0.95em' }}>
          Upload 5 images max
        </p>
      </CardHeader>

      <CardBody>
        <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
          <input {...getInputProps()} name='files' />
          <span>Drag 'n' drop some files here, or click to select files</span>
        </DropZoneContainer>

        <PreviewAside>{thumbs}</PreviewAside>
      </CardBody>

      <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={onPrevStep}>Previous</Button>
        <Button color='primary' onClick={onPreview}>
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewImagesDropZone;
