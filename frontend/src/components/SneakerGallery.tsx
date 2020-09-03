import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'reactstrap';

import SneakerCard from './SneakerCard';

import { getGallerySneakers } from 'api/api';

import { Sneaker, GallerySneakersType } from '../../../shared';

const formatSneakers = (gallerySneakers: GallerySneakersType): Sneaker[] => {
  const sneakersBySize = Object.values(gallerySneakers);

  const result: Sneaker[] = [];

  for (const obj of sneakersBySize) {
    const sneakersByName = Object.values(obj);
    for (const o of sneakersByName) {
      for (const sneaker of Object.values(o)) result.push(sneaker);
    }
  }

  return result;
};

const SneakerGallery = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  // const [filterSneakers, setFilterSneakers] = useState<Sneaker[]>([]);

  useEffect(() => {
    (async () => {
      const gallerySneakers = await getGallerySneakers();
      const allSneakers = formatSneakers(gallerySneakers);

      setSneakers(allSneakers);
    })();
  }, []);

  const CARDS_PER_ROW = 4;

  const populateCards = () => {
    const cards: JSX.Element[] = [];

    // start from -1 because the index gets incremented first in the if block
    for (let idx = -1; sneakers.length > 0 && idx < sneakers.length; ) {
      cards.push(
        <Row>
          {Array(CARDS_PER_ROW)
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
