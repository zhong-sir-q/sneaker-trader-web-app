import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { PreviewFile } from 'components/PreviewImagesDropzone';

type PreviewImgDropzoneCtxType = {
  files: PreviewFile[];
  mainFileId: string | undefined;
  formDataFromFiles: () => FormData;
  getMainDisplayFile: () => PreviewFile | undefined;
  updateFileId: (fileId: string) => void;
  onDropFile: (acceptedFiles: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  destroyFiles: () => void;
};

const INIT_PREVIEW_DROPZONE_CTX: PreviewImgDropzoneCtxType = {
  files: [],
  mainFileId: undefined,
  formDataFromFiles: () => new FormData(),
  getMainDisplayFile: () => undefined,
  destroyFiles: () => {
    throw new Error('Must overide destroyFiles');
  },
  updateFileId: () => {
    throw new Error('Must overide updateFileId');
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

const PreviewImgDropzoneProvider = (props: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [mainFileId, setMainFileId] = useState<string>();

  const updateFileId = (fileId: string) => setMainFileId(fileId);

  const destroyFiles = () => {
    for (const f of files) URL.revokeObjectURL(f.preview);
  };

  const onDropFile = (acceptedFiles: File[]) => {
    const UPLOAD_LIMIT = 5;
    if (files.length === UPLOAD_LIMIT) {
      alert('Maximum upload of 5 images!');
      return;
    }

    const filesAfterDrop = files.concat(
      acceptedFiles.map((file: any) => {
        const previewBlob = URL.createObjectURL(file);
        return Object.assign(file, { preview: previewBlob, id: uuidV4() });
      })
    );

    setFiles(filesAfterDrop);
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

export default PreviewImgDropzoneProvider;
