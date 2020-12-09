import React, { useRef } from 'react';
import styled from 'styled-components';

import Cropper from 'react-cropper';
import { Dialog } from '@material-ui/core';
import { Edit, StarBorderOutlined, RotateRight, Crop, Delete } from '@material-ui/icons';

type EditPhotoDialogProps = {
  open: boolean;
  imgSrc: string;
  isMain: boolean;
  // this is always true, defined in the scope, see reason below in toggleIsCropping
  isCropping?: boolean;
  onDone: (img: string) => void;
  onDelete: () => void;
  setAsMain: (img: string) => void;
  // no support for toggle cropping currently, because rotation relies on the Cropper component to be mounted
  toggleIsCropping?: () => void;
};

// Trademe style edit photo dialog as of 2020 December
const EditPhotoDialog = (props: EditPhotoDialogProps) => {
  const { open, imgSrc, isMain, onDone, onDelete, setAsMain, toggleIsCropping } = props;
  const isCropping = true

  const cropperRef = useRef<HTMLImageElement>(null);
  const getCropper = () => (cropperRef.current as any).cropper;

  const cropperDataUrl = () => getCropper().getCroppedCanvas().toDataURL();

  const rotateRight = () => getCropper().rotate(90);

  return (
    // TODO: define max-width and max-height for the dialog
    <Dialog fullWidth maxWidth='sm' open={open}>
      <DialogHeader>
        <DialogHeaderText>Edit photos</DialogHeaderText>
        <DialogHeaderAction onClick={() => onDone(cropperDataUrl())}>
          <Edit />
          <HeaderHelperText>Done</HeaderHelperText>
        </DialogHeaderAction>
      </DialogHeader>
      <DialogBody>
        {isCropping ? (
          <Cropper
            src={imgSrc}
            {...{
              autoCropArea: 1,
              zoomOnWheel: false,
              movable: false,
            }}
            ref={cropperRef}
          />
        ) : (
          <DialogImg src={imgSrc} />
        )}
      </DialogBody>
      <DialogFooter>
        <DialogSetMainButton isMain={isMain} onClick={() => setAsMain(cropperDataUrl())}>
          <StarBorderOutlined fontSize='default' />
          <FooterButtonText>{isMain ? 'Main Photo' : 'Set as main'}</FooterButtonText>
        </DialogSetMainButton>
        <DialogFooterButton onClick={rotateRight}>
          <RotateRight fontSize='default' />
          <FooterButtonText>Rotate</FooterButtonText>
        </DialogFooterButton>
        <DialogCropButton isCropping={isCropping} onClick={toggleIsCropping}>
          <Crop fontSize='default' />
          <FooterButtonText>Crop</FooterButtonText>
        </DialogCropButton>
        <DialogFooterButton onClick={onDelete}>
          <Delete fontSize='default' />
          <FooterButtonText>Delete</FooterButtonText>
        </DialogFooterButton>
      </DialogFooter>
    </Dialog>
  );
};

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.25rem;
`;

const DialogFooter = styled.div`
  display: flex;
  color: #007acd;
`;

const DialogFooterButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  flex: 1;
  padding: 1rem;
`;

type DialogCropButtonProps = {
  isCropping: boolean;
};

const DialogCropButton = styled(DialogFooterButton)<DialogCropButtonProps>`
  background-color: ${({ isCropping }) => (isCropping ? '#006ebd' : '')};
  color: ${({ isCropping }) => (isCropping ? '#fff' : '')};
`;

type DialogSetMainButtonProps = {
  isMain: boolean;
};

const DialogSetMainButton = styled(DialogFooterButton)<DialogSetMainButtonProps>`
  background-color: ${({ isMain }) => (isMain ? '#f9af2c' : '')};
  color: ${({ isMain }) => (isMain ? '#fff' : '')};
`;

const DialogHeaderText = styled.div`
  font-weight: 700;
  line-height: 1.75rem;
  font-size: 1.375rem;
`;

const DialogHeaderAction = styled.div`
  color: #007acd;
  line-height: 1.5rem;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
`;

const FooterButtonText = styled.div`
  margin-top: 8px;
`;

const DialogBody = styled.div`
  background-color: #f6f5f4;
  padding: 4.125rem 1.625rem;
`;

const DialogImg = styled.img``;

const HeaderHelperText = styled.span`
  vertical-align: middle;
  margin-left: 0.75rem;
`;

export default EditPhotoDialog;
