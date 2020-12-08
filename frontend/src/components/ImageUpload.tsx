import React, { createRef } from 'react';

import { Button } from 'reactstrap';
import styled from 'styled-components';

type ImageUploadProps = {
  imgPreviewUrl: string;
  canAddImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RoundedImg = styled.img`
  border-radius: 50%;
  height: 100px;
`;

const ImageUpload = (props: ImageUploadProps) => {
  const fileInputRef = createRef<HTMLInputElement>();

  const { imgPreviewUrl, canAddImage, onImageChange } = props;

  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className='fileinput text-center'>
      <input type='file' accept='image/*' onChange={onImageChange} ref={fileInputRef} />`
      <RoundedImg src={imgPreviewUrl} alt='Uploaded' />
      <div>
        {canAddImage ? (
          <Button className='btn-round' onClick={handleClick}>
            Add Photo
          </Button>
        ) : (
          <span>
            <Button className='btn-round' onClick={handleClick}>
              Update
            </Button>
            <br />
          </span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
