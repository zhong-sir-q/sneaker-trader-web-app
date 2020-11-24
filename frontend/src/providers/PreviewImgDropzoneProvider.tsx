import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { PreviewFile } from 'components/PreviewImagesDropzone';

type PreviewImgDropzoneCtxType = {
  files: PreviewFile[];
  mainFileId: string | undefined;
  croppedImgFile: string | undefined;
  cropperImage: string | undefined;
  formDataFromFiles: () => FormData;
  getMainDisplayFile: () => PreviewFile | undefined;
  updateFileId: (fileId: string) => void;
  onDropFile: (acceptedFiles: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onConfirmAddCroppedImg: (croppedImg: string) => void;
  destroyFiles: () => void;
  updateCroppedImage: (newImg: string) => void;
};

const INIT_PREVIEW_DROPZONE_CTX: PreviewImgDropzoneCtxType = {
  files: [],
  mainFileId: undefined,
  croppedImgFile: undefined,
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
  updateCroppedImage: () => {
    throw new Error('Must override!');
  },
};

export const PreviewImgDropzoneCtx = createContext(INIT_PREVIEW_DROPZONE_CTX);

export const usePreviewImgDropzoneCtx = () => useContext(PreviewImgDropzoneCtx);

const PreviewImgDropzoneProvider = (props: { children: React.ReactNode }) => {
  // these are files because we need to use it to send form data through
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [mainFileId, setMainFileId] = useState<string>();
  // main image to display inside the cropper
  const [cropperImage, setCropperImage] = useState<string>();
  // preview of the cropped image
  const [croppedImgFile, setCroppedImgFile] = useState<string>();

  const updateFileId = (fileId: string) => setMainFileId(fileId);

  const updateCroppedImage = (newImg: string) => setCroppedImgFile(newImg);

  const destroyFiles = () => {
    for (const f of files) URL.revokeObjectURL(f.preview);
  };

  const onDropFile = (acceptedFiles: File[]) => {
    const dataUrl = URL.createObjectURL(acceptedFiles[0]);
    updateCroppedImage(dataUrl);
    setCropperImage(dataUrl);

    // const UPLOAD_LIMIT = 5;

    // if (files.length === UPLOAD_LIMIT) {
    //   alert('Maximum upload of 5 images!');
    //   return;
    // }
    // const filesAfterDrop = files.concat(
    //   acceptedFiles.map((file: any) => {
    //     const previewBlob = URL.createObjectURL(file);
    //     return Object.assign(file, { preview: previewBlob, id: uuidV4() });
    //   })
    // );

    // setFiles(filesAfterDrop);
  };

  const createPreviewFile = (f: File) => {
    const previewDataUrl = URL.createObjectURL(f);
    return Object.assign(f, { preview: previewDataUrl, id: uuidV4() });
  };

  const createBlob = (fileDataUrl: string) => fetch(fileDataUrl).then((res) => res.blob());

  const resetCropper = () => {
    setCropperImage('');
    updateCroppedImage('');
  };

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
        croppedImgFile,
        onConfirmAddCroppedImg,
        destroyFiles,
        getMainDisplayFile,
        formDataFromFiles,
        updateFileId,
        updateCroppedImage,
        onDropFile,
        onRemoveFile,
      }}
    >
      {props.children}
    </PreviewImgDropzoneCtx.Provider>
  );
};

export default PreviewImgDropzoneProvider;
