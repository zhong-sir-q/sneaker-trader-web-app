import React from 'react';
import { Col, Row } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { Sneaker } from '../../../shared';

type SneakerGalleryProps = {
  sneakers: Sneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => {
  const render = () => {
    return (
      <Row xs='4' sm='4' md='4'>
        {props.sneakers.map((s, idx) => {
          const { size, ...sneaker } = s;

          return (
            <Col key={idx}>
              <SneakerCard isListed sneaker={sneaker} maxWidth='235px' />
            </Col>
          );
        })}
      </Row>
    );
  };

  return render();
};

export default SneakerGallery;
