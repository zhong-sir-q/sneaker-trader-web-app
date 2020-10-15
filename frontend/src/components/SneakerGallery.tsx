import React from 'react';
import { Container, Row } from 'reactstrap';
import { GallerySneaker } from '../../../shared';
import SneakerCard from './SneakerCard';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => {
  const render = () => {
    return (
      <Container>
        <Row xs='2' sm='2' md='4'>
          {props.sneakers.map((s, idx) => {
            return <SneakerCard className='mr-4' isListed sneaker={s} key={idx} price={s.minPrice} />;
          })}
        </Row>
      </Container>
    );
  };

  return render();
};

export default SneakerGallery;
