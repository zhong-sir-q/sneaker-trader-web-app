import React, { createContext, useContext, useState } from 'react';
import { PreviewFile } from 'components/PreviewImagesDropzone';

type PreviewImgDropzoneCtxType = {
  files: PreviewFile[];
  mainFileId: string | undefined;
  formDataFromFiles: () => FormData;
  getMainDisplayFile: () => PreviewFile | undefined;
  updateFileId: (fileId: string) => void;
  onDropFile: (newFiles: PreviewFile[]) => void;
  onRemoveFile: (fileId: string) => void;
};

const INIT_CTX: PreviewImgDropzoneCtxType = {
  files: [],
  mainFileId: undefined,
  formDataFromFiles: () => new FormData(),
  getMainDisplayFile: () => undefined,
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

const PreviewImgDropzoneCtx = createContext(INIT_CTX);

export const usePreviewImgDropzoneCtx = () => useContext(PreviewImgDropzoneCtx);

const PreviewImgDropzoneCtxProvider = (props: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [mainFileId, setMainFileId] = useState<string>();

  const updateFileId = (fileId: string) => setMainFileId(fileId);

  const onDropFile = (newFiles: PreviewFile[]) => setFiles(newFiles);

  const onRemoveFile = (fileId: string) => {
    if (mainFileId === fileId) setMainFileId(undefined);

    const filesAfterRemoval = files.filter((file) => file.id !== fileId);
    setFiles(filesAfterRemoval);
  };

  const getMainFileIdx = () => files.findIndex((f) => f.id === mainFileId);

  const getMainDisplayFile = () => files[getMainFileIdx()];

  const formDataFromFiles = () => {
    const formData = new FormData();

    const mainFileIdx = getMainFileIdx();
    const tmp = files[0];
    files[0] = files[mainFileIdx];
    files[mainFileIdx] = tmp;

    for (const f of files) formData.append('files', f);

    return formData;
  };

  return (
    <PreviewImgDropzoneCtx.Provider
      value={{ files, mainFileId, getMainDisplayFile, formDataFromFiles, updateFileId, onDropFile, onRemoveFile }}
    >
      {props.children}
    </PreviewImgDropzoneCtx.Provider>
  );
};

export default PreviewImgDropzoneCtxProvider;
