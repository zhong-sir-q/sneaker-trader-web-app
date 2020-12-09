import React, { useState, useEffect } from 'react';

import { BackgroundImgProps } from './BackgroundImg';

type LazyBackgroundImgProps = {
  placeholder: string;
  BackgroundImgElement: (props: BackgroundImgProps) => JSX.Element;
} & BackgroundImgProps;

const LazyBackgroundImg = (props: LazyBackgroundImgProps) => {
  const [src, setSrc] = useState<string>();

  const { background, BackgroundImgElement } = props;

  useEffect(() => {
    const imageLoader = new Image();
    imageLoader.src = background;

    imageLoader.onload = () => setSrc(background);
  }, [background]); 

  return <BackgroundImgElement {...props} background={src || props.placeholder} />;
};

export default LazyBackgroundImg;
