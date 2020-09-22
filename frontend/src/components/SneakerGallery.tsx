import React from 'react';
import { Row } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { GallerySneaker } from '../../../shared';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => {
  const render = () => {
    return (
      <Row className='margin-right-except-last' xs='3' sm='4' md='5'>
        {props.sneakers.map((s, idx) => {
          return <SneakerCard isListed sneaker={s} key={idx} price={s.minPrice} />;
        })}
      </Row>
    );
  };

  return render();
};

export default SneakerGallery;
