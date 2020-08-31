import { v4 as uuidV4 } from 'uuid';
import React from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import { Button } from 'reactstrap';

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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props: any) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const PreviewAside = styled.aside`
  display: flex;
`;

const Thumb = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2;
  border: '1px solid #eaeaea';
  margin-bottom: 8;
  margin-right: 8;
  padding: 4;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  margin-bottom: 5px;
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

type PreviewFile = File & {
  preview: string;
  id: string;
};

type PreviewImagesDropZoneProps = {
  files: PreviewFile[];
  mainFileId: string | undefined;
  onPrevStep: () => void;
  onNextStep: () => void;
  onDropFile: (newFiles: PreviewFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onClickImage: (fileId: string) => void;
};

// TODO: restyle the component, improve the UI
// TODO: set a max limit of 5 files;
const PreviewImagesDropZone = (props: PreviewImagesDropZoneProps) => {
  const { files, mainFileId, onPrevStep, onNextStep, onDropFile, onRemoveFile, onClickImage } = props;
  // const [exceedLimitError, setExceedLimitError] = useState('')

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const filesAfterAddition = files.concat(
        acceptedFiles.map((file: any) => {
          const previewBlob = URL.createObjectURL(file);
          return Object.assign(file, { preview: previewBlob, id: uuidV4() });
        })
      );

      onDropFile(filesAfterAddition);
    },
  });

  // reject user if the main image has not be selected yet
  const onPreview = () => {
    // TODO: DEBUG WHY AFTER REMOVING THE SELECT FILE, 
    // the main file id does not reset to undefined
    if (!mainFileId || mainFileId.length === 0) {
      alert('Select a main image to display');
      return;
    }

    onNextStep();
  };

  const thumbs = files.map((file) => (
    <Thumb onClick={() => onClickImage(file.id)} key={file.preview}>
      {/* TODO: find out how to do conditional styling to styled component */}
      <PreviewImage style={{ border: mainFileId === file.id ? 'solid 1px green' : '' }} src={file.preview} alt={file.name} />
      {/* TODO: replace this with a cross or a bin icon */}
      <Button onClick={() => onRemoveFile(file.id)}>
        <i className='now-ui-icons design_bullet-list-67' />
      </Button>
    </Thumb>
  ));

  return (
    <section>
      <p className='category' style={{ fontSize: '0.95em' }}>
        <GreenDot /> Main Display Image, Click To Select One
      </p>
      <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} name='files' />
        <span>Drag 'n' drop some files here, or click to select files</span>
      </DropZoneContainer>
      {/* TODO: styling. Each card should occupy a specific proportion and give it some margin */}
      <PreviewAside>{thumbs}</PreviewAside>
      <Button onClick={onPrevStep}>Previous</Button>
      <Button color='primary' onClick={onPreview}>
        Preview
      </Button>
    </section>
  );
};

export default PreviewImagesDropZone;
