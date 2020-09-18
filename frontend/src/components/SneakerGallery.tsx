import React from 'react';
import { Row } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { Sneaker } from '../../../shared';

type SneakerGalleryProps = {
  sneakers: Sneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => {
  const render = () => {
    return (
      <Row className='margin-right-except-last' xs='3' sm='4' md='6'>
        {props.sneakers.map((s, idx) => {
          const { size, ...sneaker } = s;

          return <SneakerCard isListed sneaker={sneaker} key={idx} />;
        })}
      </Row>
    );
  };

  return render();
};

export default SneakerGallery;
