import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { getProducts } from 'api/api';

import { Sneaker } from '../../../shared';

// TODO: optimize performance, store the fetched result in a cache and render from there
const SneakerGallery = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);

  useEffect(() => {
    (async () => {
      const allSneakers = await getProducts();
      setSneakers(allSneakers);
    })();
  }, []);

  const populateCards = () => {
    const cards: JSX.Element[] = [];

    // start from -1 because the index gets incremented first in the if block
    for (let idx = -1; sneakers.length > 0 && idx < sneakers.length; ) {
      cards.push(
        <Row>
          {Array(4)
            .fill(0)
            .map((_) => {
              if (idx++ < sneakers.length && sneakers[idx])
                return (
                  <Col key={sneakers[idx].id} xs='3'>
                    <SneakerCard isListed sneaker={sneakers[idx]} maxWidth='235px' />
                  </Col>
                );
              else return undefined;
            })}
        </Row>
      );
    }

    return cards;
  };

  return <Container>{populateCards()}</Container>;
};

export default SneakerGallery;
