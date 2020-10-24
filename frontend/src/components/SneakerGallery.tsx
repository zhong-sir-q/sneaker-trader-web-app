import React from 'react';
import { Container, Row } from 'reactstrap';
import { GallerySneaker } from '../../../shared';
import SneakerCard from './SneakerCard';

import { getMainDisplayImgUrl } from 'utils/utils';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => (
  <Container>
    <Row xs='2' sm='2' md='3' lg='3'>
      {props.sneakers.map((s, idx) => {
        return (
          <SneakerCard
            className='p-1'
            mainDisplayImage={getMainDisplayImgUrl(s.imageUrls)}
            isListed
            sneaker={s}
            key={idx}
            price={s.minPrice}
          />
        );
      })}
    </Row>
  </Container>
);

export default SneakerGallery;
