import React, { createContext, useContext, useState } from 'react';

import { PreviewFile } from 'components/PreviewImagesDropzone';
import AlertDialogProvider, { useAlertComponent } from './AlertDialogProvider';
import { createPreviewFileFromDataUrl, createPreviewFile } from 'utils/utils';
import { LISTING_FILE_UPLOAD_LIMIT } from 'const/variables';

type PreviewImgDropzoneCtxType = {
  files: PreviewFile[];
  cropperImages: string[];
  mainFileId: string | undefined;
  mainDisplayFileDataUrl: string | undefined;
  resetCropperImages: () => void;
  onRemoveFromCropperImages: (img: string) => void;
  onRemoveFromCropperImagesByIdx: (idx: number) => void;
  formDataFromFiles: () => FormData;
  updateMainFileId: (fileId: string) => void;
  updateFile: (newImg: string, fileId: string) => void;
  onDropFile: (acceptedFiles: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onAddCroppedImgs: (croppedImgs: string[]) => void;
  destroyFiles: () => void;
};

const INIT_PREVIEW_DROPZONE_CTX: PreviewImgDropzoneCtxType = {
  files: [],
  mainFileId: undefined,
  cropperImages: [],
  mainDisplayFileDataUrl: undefined,
  formDataFromFiles: () => new FormData(),
  onRemoveFromCropperImages: () => {
    throw new Error('Must override!');
  },
  onRemoveFromCropperImagesByIdx: () => {
    throw new Error('Must override!');
  },
  resetCropperImages: () => {
    throw new Error('Must override!');
  },
  destroyFiles: () => {
    throw new Error('Must overide!');
  },
  updateMainFileId: () => {
    throw new Error('Must overide!');
  },
  updateFile: () => {
    throw new Error('Must override!');
  },
  onAddCroppedImgs: () => {
    throw new Error('Must override!');
  },
  onDropFile: () => {
    throw new Error('Must overide!');
  },
  onRemoveFile: () => {
    throw new Error('Must overide!');
  },
};

export const PreviewImgDropzoneCtx = createContext(INIT_PREVIEW_DROPZONE_CTX);

export const usePreviewImgDropzoneCtx = () => useContext(PreviewImgDropzoneCtx);

const PreviewImgDropzoneProvider = (props: { children: React.ReactNode; previewFiles?: PreviewFile[] }) => {
  // these are files because we need to use it to send form data through
  const [files, setFiles] = useState<PreviewFile[]>(props.previewFiles || []);
  const [mainFileId, setMainFileId] = useState<string>();

  // sources of the image files
  const [cropperImages, setCropperImages] = useState<string[]>([]);
  const resetCropperImages = () => setCropperImages([]);

  const { onOpenAlert } = useAlertComponent();

  const updateMainFileId = (fileId: string) => setMainFileId(fileId);

  const destroyFiles = () => {
    for (const f of files) URL.revokeObjectURL(f.preview);
  };

  const onDropFile = (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > LISTING_FILE_UPLOAD_LIMIT) {
      onOpenAlert();
      return;
    }

    const newDataUrls = acceptedFiles.map((f) => URL.createObjectURL(f));
    setFiles(files.concat(acceptedFiles.map((f) => createPreviewFile(f))));
    setCropperImages(cropperImages.concat(newDataUrls));
  };

  const onAddCroppedImgs = async (imgs: string[]) => {
    const newPreviewFiles = await Promise.all(imgs.map((img) => createPreviewFileFromDataUrl(img)));
    setFiles(files.concat(newPreviewFiles));
  };

  const onRemoveFromCropperImages = (img: string) => setCropperImages(cropperImages.filter((image) => image !== img));

  const onRemoveFromCropperImagesByIdx = (idx: number) =>
    setCropperImages(cropperImages.filter((_img, index) => index !== idx));

  const onRemoveFile = (fileId: string) => {
    if (mainFileId === fileId) setMainFileId(undefined);

    const filesAfterRemoval = files.filter((file) => file.id !== fileId);
    setFiles(filesAfterRemoval);
  };

  const getMainFileIdx = () => files.findIndex((f) => f.id === mainFileId);

  const getMainDisplayFileDataUrl = () => files[getMainFileIdx()]?.preview;

  const formDataFromFiles = () => {
    const formData = new FormData();

    // swap the main file with the first image
    // because the preview sneaker card will use
    // the first file as the main display image
    const mainFileIdx = getMainFileIdx();
    const tmp = files[0];

    files[0] = files[mainFileIdx];
    files[mainFileIdx] = tmp;

    for (const f of files) formData.append('files', f);

    return formData;
  };

  const updateFile = async (newImg: string, fileId: string) => {
    const newFiles = await Promise.all(
      files.map(async (f) => {
        if (f.id !== fileId) return f;

        const newDisplayFile = await createPreviewFileFromDataUrl(newImg, f.id);
        return newDisplayFile;
      })
    );

    setFiles(newFiles);
  };

  return (
    <PreviewImgDropzoneCtx.Provider
      value={{
        files,
        mainFileId,
        cropperImages,
        mainDisplayFileDataUrl: getMainDisplayFileDataUrl(),
        onRemoveFromCropperImages,
        onRemoveFromCropperImagesByIdx,
        resetCropperImages,
        onAddCroppedImgs,
        destroyFiles,
        updateFile,
        formDataFromFiles,
        updateMainFileId,
        onDropFile,
        onRemoveFile,
      }}
    >
      {props.children}
    </PreviewImgDropzoneCtx.Provider>
  );
};

export default (props: { children: React.ReactNode; previewFiles?: PreviewFile[] }) => (
  <AlertDialogProvider color='danger' message='Maximum upload of 5 images!'>
    <PreviewImgDropzoneProvider previewFiles={props.previewFiles}>{props.children}</PreviewImgDropzoneProvider>
  </AlertDialogProvider>
);
