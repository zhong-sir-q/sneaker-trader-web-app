import React, { useEffect, useRef, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import { Button, Card, CardFooter, CardHeader, CardBody } from 'reactstrap';
import { usePreviewImgDropzoneCtx } from 'providers/PreviewImgDropzoneProvider';

import Cropper from 'react-cropper';
import { DeleteForever, RotateRight, RotateLeft, Edit } from '@material-ui/icons';
import { Slider, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

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
  border: 3.5px solid;
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

const CropperGridWrapper = styled.div`
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3px;
  align-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
    height: 31.25em;
    overflow: auto;
  }
`;

const CropperGrid = () => {
  const {
    cropperImages,
    onAddCroppedImgs,
    onRemoveFromCropperImages,
    onRemoveFromCropperImagesByIdx,
  } = usePreviewImgDropzoneCtx();

  const onConfirmCrop = (img: string, idx: number) => {
    onAddCroppedImgs([img]);
    onRemoveFromCropperImagesByIdx(idx);
  };

  return (
    <React.Fragment>
      <CropperGridWrapper>
        {cropperImages.map((img, idx) => (
          <ImgCropper
            img={img}
            key={idx}
            onRemove={onRemoveFromCropperImages}
            onConfirmCrop={(img) => onConfirmCrop(img, idx)}
          />
        ))}
      </CropperGridWrapper>
    </React.Fragment>
  );
};

const SliderContainer = styled.div`
  width: 220px;

  @media (max-width: 528px) {
    width: 180px;
  }
`;

type ImgCropperProps = {
  img: string;
  // add a single image
  onConfirmCrop?: (img: string) => void;
  onImgChange?: (img: string) => void;
  onRemove?: (img: string) => void;
};

const ImgCropper = (props: ImgCropperProps) => {
  const cropperRef = useRef<HTMLImageElement>(null);

  // set it to 20 to allow the initial zoom out of the image
  const INIT_SLIDER_VAL = 20;
  const [sliderVal, setSliderVal] = useState<number | number[]>(INIT_SLIDER_VAL);

  const { img, onRemove, onImgChange, onConfirmCrop } = props;

  const getCropper = () => (cropperRef.current as any).cropper;

  const cropperDataUrl = () => getCropper().getCroppedCanvas().toDataURL();

  const handleImgChange = () => {
    if (onImgChange) onImgChange(cropperDataUrl());
  };

  const handleSliderChange = (_evt: React.ChangeEvent<{}>, newVal: number | number[]) => {
    if (typeof newVal === 'number' && typeof sliderVal === 'number') {
      const zoomRatio = 0.1;
      const delta = (newVal - sliderVal) / 10;
      getCropper().zoom(delta * zoomRatio);
    }

    setSliderVal(newVal);
    handleImgChange();
  };

  const rotateLeft = () => getCropper().rotate(-90);

  const rotateRight = () => getCropper().rotate(90);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Cropper
        src={img}
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
      <SliderContainer>
        <Slider value={sliderVal} onChange={handleSliderChange} />
      </SliderContainer>
      <div style={{ fontSize: '32px', width: '140px', display: 'flex', justifyContent: 'space-around' }}>
        <RotateLeft onClick={rotateLeft} fontSize='inherit' />
        {onRemove && <DeleteForever onClick={() => onRemove(img)} fontSize='inherit' />}
        <RotateRight onClick={rotateRight} fontSize='inherit' />
      </div>
      {onConfirmCrop && (
        <Button color='primary' onClick={() => onConfirmCrop(cropperDataUrl())}>
          Crop Image
        </Button>
      )}
    </div>
  );
};

const ThumbsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  margin-bottom: 15px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
    max-height: 1024px;
    overflow: auto;
  }
`;

const FileEditingOptionsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  font-size: 2em;
  width: 40%;
  margin-top: 5px;
`;

const PreviewImagesDropzone = (props: PreviewImagesDropZoneProps) => {
  const { onPrevStep, onNextStep } = props;
  const {
    files,
    mainFileId,
    cropperImages,
    mainDisplayFileDataUrl,
    onDropFile,
    onRemoveFile,
    updateFileId,
    updateMainDisplayFile,
  } = usePreviewImgDropzoneCtx();

  // set the first image to be the default main display
  useEffect(() => {
    if (!mainFileId && files.length > 0) updateFileId(files[0].id);
  }, [mainFileId, files, updateFileId]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: onDropFile,
  });

  const editingFileCropperHook = useOpenCloseComp();

  // can only update the main display file
  const onFinishEditFile = (img: string) => {
    editingFileCropperHook.onClose();
    updateMainDisplayFile(img);
  };

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

        {files.length > 0 && (
          <React.Fragment>
            <h4>Selected Images</h4>
            <ThumbsWrapper data-testid='preview-img-container'>
              {files.map((file, idx) => (
                <Thumb isFirstChild={idx === 0} key={file.id}>
                  <PreviewImage
                    isImageSelected={mainFileId === file.id}
                    onClick={() => updateFileId(file.id)}
                    src={file.preview}
                    alt={file.name}
                  />
                  <FileEditingOptionsWrapper>
                    <Edit
                      className='pointer'
                      fontSize='inherit'
                      onClick={() => {
                        // set the editing file to the main display file
                        updateFileId(file.id);
                        editingFileCropperHook.onOpen();
                      }}
                    />
                    <DeleteForever
                      className='pointer'
                      fontSize='inherit'
                      onClick={() => onRemoveFile(file.id)}
                      data-testid={`del-preview-${idx}`}
                    />
                  </FileEditingOptionsWrapper>
                </Thumb>
              ))}
            </ThumbsWrapper>
          </React.Fragment>
        )}

        {cropperImages.length > 0 && (
          <React.Fragment>
            <h4>Crop Images</h4>
            <CropperGrid />
          </React.Fragment>
        )}

        <Dialog open={editingFileCropperHook.open} onClose={editingFileCropperHook.onClose}>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogContent>
            {mainDisplayFileDataUrl && <ImgCropper img={mainDisplayFileDataUrl} onConfirmCrop={onFinishEditFile} />}
          </DialogContent>
        </Dialog>
      </CardBody>

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
