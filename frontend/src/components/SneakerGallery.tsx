import React from 'react';
import { Row, Container } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { GallerySneaker } from '../../../shared';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => {
  const render = () => {
    return (
      <Container>
        <Row xs='2' sm='4' md='4'>
          {props.sneakers.map((s, idx) => {
            return <SneakerCard className='pl-1 pl-sm-2 pl-md-3 pl-lg-4 pl-xl-5' isListed sneaker={s} key={idx} price={s.minPrice} />;
          })}
        </Row>
      </Container>
    );
  };

  return render();
};

export default SneakerGallery;
