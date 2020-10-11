import React, { createRef } from 'react';

import { Button } from 'reactstrap';

type ImageUploadProps = {
  imgPreviewUrl: string;
  canAddImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload = (props: ImageUploadProps) => {
  const fileInputRef = createRef<HTMLInputElement>();

  const { imgPreviewUrl, canAddImage, onImageChange } = props;

  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className='fileinput text-center'>
      <input type='file' onChange={onImageChange} ref={fileInputRef} />`
      <div className='thumbnail img-circle'>
        <img src={imgPreviewUrl} alt='uploaed file' />
      </div>
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
