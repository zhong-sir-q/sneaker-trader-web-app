import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { PreviewFile } from 'components/PreviewImagesDropzone';
import AlertDialogProvider, { useAlertComponent } from './AlertDialogProvider';

type PreviewImgDropzoneCtxType = {
  files: PreviewFile[];
  mainFileId: string | undefined;
  cropperImage: string | undefined;
  formDataFromFiles: () => FormData;
  getMainDisplayFile: () => PreviewFile | undefined;
  updateFileId: (fileId: string) => void;
  onDropFile: (acceptedFiles: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onConfirmAddCroppedImg: (croppedImg: string) => void;
  destroyFiles: () => void;
};

const INIT_PREVIEW_DROPZONE_CTX: PreviewImgDropzoneCtxType = {
  files: [],
  mainFileId: undefined,
  cropperImage: undefined,
  formDataFromFiles: () => new FormData(),
  getMainDisplayFile: () => undefined,
  destroyFiles: () => {
    throw new Error('Must overide destroyFiles');
  },
  updateFileId: () => {
    throw new Error('Must overide updateFileId');
  },
  onConfirmAddCroppedImg: () => {
    throw new Error('Must override!');
  },
  onDropFile: () => {
    throw new Error('Must overide onDropFile');
  },
  onRemoveFile: () => {
    throw new Error('Must overide onRemoveFile');
  },
};

export const PreviewImgDropzoneCtx = createContext(INIT_PREVIEW_DROPZONE_CTX);

export const usePreviewImgDropzoneCtx = () => useContext(PreviewImgDropzoneCtx);

const PreviewImgDropzoneProvider = (props: { children: React.ReactNode; previewFiles?: PreviewFile[] }) => {
  // these are files because we need to use it to send form data through
  const [files, setFiles] = useState<PreviewFile[]>(props.previewFiles || []);
  const [mainFileId, setMainFileId] = useState<string>();
  // main image to display inside the cropper
  const [cropperImage, setCropperImage] = useState<string>();

  const { onOpenAlert } = useAlertComponent();

  const updateFileId = (fileId: string) => setMainFileId(fileId);

  const destroyFiles = () => {
    for (const f of files) URL.revokeObjectURL(f.preview);
  };

  const onDropFile = (acceptedFiles: File[]) => {
    const UPLOAD_LIMIT = 5;

    if (files.length === UPLOAD_LIMIT) {
      onOpenAlert();
      return;
    }

    const dataUrl = URL.createObjectURL(acceptedFiles[0]);
    setCropperImage(dataUrl);
  };

  const createPreviewFile = (f: File) => {
    const previewDataUrl = URL.createObjectURL(f);
    return Object.assign(f, { preview: previewDataUrl, id: uuidV4() });
  };

  const createBlob = (fileDataUrl: string) => fetch(fileDataUrl).then((res) => res.blob());

  const resetCropper = () => setCropperImage(undefined);

  const onConfirmAddCroppedImg = async (img: string) => {
    const file: File = new File([await createBlob(img)], uuidV4());
    const previewFile = createPreviewFile(file);
    setFiles([...files, previewFile]);
    resetCropper();
  };

  const onRemoveFile = (fileId: string) => {
    if (mainFileId === fileId) setMainFileId(undefined);

    const filesAfterRemoval = files.filter((file) => file.id !== fileId);
    setFiles(filesAfterRemoval);
  };

  const getMainFileIdx = () => files.findIndex((f) => f.id === mainFileId);

  const getMainDisplayFile = () => files[getMainFileIdx()];

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

  return (
    <PreviewImgDropzoneCtx.Provider
      value={{
        files,
        mainFileId,
        cropperImage,
        onConfirmAddCroppedImg,
        destroyFiles,
        getMainDisplayFile,
        formDataFromFiles,
        updateFileId,
        onDropFile,
        onRemoveFile,
      }}
    >
      {props.children}
    </PreviewImgDropzoneCtx.Provider>
  );
};

export default (props: { children: React.ReactNode; previewFiles?: PreviewFile[] }) => (
  <AlertDialogProvider color='danger' msg='Maximum upload of 5 images!'>
    <PreviewImgDropzoneProvider previewFiles={props.previewFiles}>{props.children}</PreviewImgDropzoneProvider>
  </AlertDialogProvider>
);
