import React, { useRef, useState } from 'react';

import { Slider } from '@material-ui/core';
import { RotateLeft, DeleteForever, RotateRight } from '@material-ui/icons';

import { Button } from 'reactstrap';
import Cropper from 'react-cropper';

import styled from 'styled-components';

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
        ref={cropperRef}
        {...{
          viewMode: 1,
          // move the canvas
          dragMode: 'move',
          background: false,
          aspectRatio: 4 / 3,
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

export default ImgCropper;
