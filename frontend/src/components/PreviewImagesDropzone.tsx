import React, { useEffect, useRef, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import { Button, Card, CardFooter, CardHeader, CardBody } from 'reactstrap';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import Cropper from 'react-cropper';
import { DeleteForever, RotateRight, RotateLeft } from '@material-ui/icons';
import { Slider } from '@material-ui/core';

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

type ThumbProps = {
  isFirstChild: boolean;
};

// flex = 1 so each sneaker preview thumb occupy the same proportion of the container
const Thumb = styled.div<ThumbProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-left: ${({ isFirstChild }) => (isFirstChild ? 0 : '10px')};
`;

type PreviewImageProps = {
  isImageSelected: boolean;
};

const PreviewImage = styled.img<PreviewImageProps>`
  width: 100%;
  height: 100%;
  border: 2.5px solid;
  border-color: ${({ isImageSelected }) => (isImageSelected ? 'green' : '#eaeaea')};
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
  onPrevStep?: () => void;
  onNextStep?: () => void;
};

const ImgCropper: React.FC = () => {
  const cropperRef = useRef<HTMLImageElement>(null);

  // set it to 20 to allow the initial zoom out of the image
  const INIT_SLIDER_VAL = 20;
  const [sliderVal, setSliderVal] = useState<number | number[]>(INIT_SLIDER_VAL);
  const { cropperImage, onConfirmAddCroppedImg } = usePreviewImgDropzoneCtx();

  useEffect(() => {
    // reset the slider value whenever the cropperImage is updated
    setSliderVal(INIT_SLIDER_VAL);
  }, [cropperImage]);

  const handleSliderChange = (_evt: React.ChangeEvent<{}>, newVal: number | number[]) => {
    if (typeof newVal === 'number' && typeof sliderVal === 'number') {
      const zoomRatio = 0.1;
      const delta = (newVal - sliderVal) / 10;
      getCropper().zoom(delta * zoomRatio);
    }

    setSliderVal(newVal);
  };

  const getCropper = () => (cropperRef.current as any).cropper;

  const onConfirmCrop = () => {
    const dataUrl = getCropper().getCroppedCanvas().toDataURL();
    onConfirmAddCroppedImg(dataUrl);
  };

  const rotateLeft = () => getCropper().rotate(-90);
  const rotateRight = () => getCropper().rotate(90);

  if (!cropperImage) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Cropper
        src={cropperImage}
        style={{ width: '100%' }}
        // Cropper.js options
        initialAspectRatio={16 / 9}
        ref={cropperRef}
        {...{
          viewMode: 1,
          // move the canvas
          dragMode: 'move',
          background: false,
          aspectRatio: 1.3333,
          autoCropArea: 0.8,
          center: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          guides: false,
          zoomOnWheel: false,
          zoomOnTouch: false,
        }}
      />
      <div style={{ width: '220px' }}>
        <Slider value={sliderVal} onChange={handleSliderChange} />
      </div>
      <div style={{ fontSize: '32px', width: '120px', display: 'flex', justifyContent: 'space-around' }}>
        <RotateLeft onClick={rotateLeft} fontSize='inherit' />
        <RotateRight onClick={rotateRight} fontSize='inherit' />
      </div>
      <Button color='primary' onClick={onConfirmCrop}>
        Confirm
      </Button>
    </div>
  );
};

const PreviewImagesDropzone = (props: PreviewImagesDropZoneProps) => {
  const { onPrevStep, onNextStep } = props;
  const { files, mainFileId, onDropFile, onRemoveFile, updateFileId } = usePreviewImgDropzoneCtx();

  const thumbs = files.map((file, idx) => (
    <Thumb isFirstChild={idx === 0} key={file.id}>
      <PreviewImage
        isImageSelected={mainFileId === file.id}
        onClick={() => updateFileId(file.id)}
        src={file.preview}
        alt={file.name}
      />
      <DeleteForever onClick={() => onRemoveFile(file.id)} data-testid={`del-preview-${idx}`} />
    </Thumb>
  ));

  // set the first image to be the default main display
  useEffect(() => {
    if (!mainFileId && thumbs.length > 0) updateFileId(thumbs[0].key as string);
  }, [mainFileId, thumbs, updateFileId]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: onDropFile,
  });

  return (
    <Card style={{ padding: '15px 15px 0px 15px' }}>
      <CardHeader style={{ textAlign: 'center' }}>
        <p>
          <GreenDot /> Main Display Image
        </p>
        <p className='category' style={{ fontSize: '0.95em' }}>
          Upload 5 images max
        </p>
      </CardHeader>

      <CardBody>
        <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
          <input {...getInputProps()} name='files' data-testid='preview-img-dropzone' />
          <span>Select Images</span>
        </DropZoneContainer>

        <div className='flex' data-testid='preview-img-container'>
          {thumbs}
        </div>
      </CardBody>

      <ImgCropper />

      {props.onPrevStep && props.onNextStep && (
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

export default PreviewImagesDropzone;
