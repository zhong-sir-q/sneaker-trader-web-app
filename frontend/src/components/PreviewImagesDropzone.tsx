import React, { useEffect, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import { Button, Card, CardFooter, CardHeader, CardBody } from 'reactstrap';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { LISTING_FILE_UPLOAD_LIMIT } from 'const/variables';
import EditPhotoDialog from './dialog/EditPhotoDialog';

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
  margin-bottom: 10px;
`;

export type PreviewFile = File & {
  preview: string;
  id: string;
};

type PreviewImagesDropZoneProps = {
  onPrevStep?: () => void;
  onNextStep?: () => void;
};

const PreviewImagesDropzone = (props: PreviewImagesDropZoneProps) => {
  const { onPrevStep, onNextStep } = props;
  const { files, mainFileId, cropperImages, onDropFile, updateMainFileId } = usePreviewImgDropzoneCtx();

  // set the first image to be the default main display
  useEffect(() => {
    if (!mainFileId && files.length > 0) updateMainFileId(files[0].id);
  }, [mainFileId, files, updateMainFileId]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: onDropFile,
  });

  return (
    <Card style={{ padding: '15px 15px 0px 15px' }}>
      <CardHeader>
        <HeaderText>Photos</HeaderText>
        <LimitText>
          Upload photos ({files.length}/{LISTING_FILE_UPLOAD_LIMIT})
        </LimitText>
      </CardHeader>

      <CardBody>
        <DropZoneContainer className='text-center' {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
          <input {...getInputProps()} name='files' data-testid='preview-img-dropzone' />
          <span>Select Images</span>
        </DropZoneContainer>

        {files.length > 0 && (
          <ImagesWrapper>
            {files.map((f, idx) => {
              const cropperImg = cropperImages[idx];

              return <EditableImage file={f} cropperImage={cropperImg} idx={idx} key={idx} />;
            })}
          </ImagesWrapper>
        )}
      </CardBody>

      {onPrevStep && onNextStep && (
        <CardFooter style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button onClick={onPrevStep}>Previous</Button>
          <Button
            disabled={files.length === 0}
            color='primary'
            onClick={onNextStep}
            data-testid='dropzone-confirm-preview-btn'
          >
            Preview
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

type EditableImageProps = {
  file: PreviewFile;
  cropperImage: string;
  idx: number;
};

const EditableImage = (props: EditableImageProps) => {
  const { file, cropperImage, idx } = props;

  // set is cropping to always true, the rotate function relies
  // on the cropper to be mounted.

  const [isCropping] = useState(true);

  const {
    mainFileId,
    onRemoveFile,
    updateFile,
    updateMainFileId,
    onRemoveFromCropperImagesByIdx,
  } = usePreviewImgDropzoneCtx();

  const { open, onOpen, onClose } = useOpenCloseComp();

  // the img may or may not have been edited
  // update the data url of the respective image
  const onDoneEditing = (editedImg: string) => {
    updateFile(editedImg, file.id);
    onClose();
  };

  const onSetMain = (img: string) => {
    updateFile(img, file.id);
    updateMainFileId(file.id);
  };

  const onRemove = () => {
    onClose();
    onRemoveFromCropperImagesByIdx(idx);
    onRemoveFile(file.id);
  };

  return (
    <React.Fragment>
      <BackgroundImgWrapper onClick={onOpen}>
        <BackgroundImg background={file.preview}>
          <HeightController aspectratio='100%' />
        </BackgroundImg>
      </BackgroundImgWrapper>
      <EditPhotoDialog
        open={open}
        imgSrc={cropperImage}
        isCropping={isCropping}
        isMain={file.id === mainFileId}
        onDone={onDoneEditing}
        onDelete={onRemove}
        setAsMain={onSetMain}
      />
    </React.Fragment>
  );
};

const HeaderText = styled.div`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  line-height: 36px;
  font-weight: 700;
`;

const LimitText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  line-height: 24px;
`;

const ImagesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type BackgroundImgProps = {
  background: string;
};

const BackgroundImg = styled.div<BackgroundImgProps>`
  background-image: url(${({ background }) => `"${background}"`});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border: 1px solid #d7d5d2;
  border-radius: 8px;
  flex: 0 0 auto;
`;

const BackgroundImgWrapper = styled.div`
  width: 33.333%;
  padding: 0 12px;
  margin-bottom: 12px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 50%;
  }
`;

type HeightControllerProps = {
  aspectratio: string;
};

const HeightController = styled.div<HeightControllerProps>`
  padding-top: ${({ aspectratio }) => aspectratio};
`;

export default PreviewImagesDropzone;
