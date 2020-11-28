import React from 'react';
import { Container, Row } from 'reactstrap';
import { GallerySneaker } from '../../../shared';
import SneakerCard from './SneakerCard';

import { getMainDisplayImgUrl } from 'utils/utils';
import { useHistory } from 'react-router-dom';
import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const SneakerGallery = (props: SneakerGalleryProps) => {
  const history = useHistory();

  return (
    <Container>
      <Row data-testid='market-place-gallery' xs='2' sm='2' md='3' lg='3'>
        {props.sneakers.map((s, idx) => {
          const onClick = () => redirectBuySneakerPage(history, s.name, s.colorway);

          return (
            <SneakerCard
              className='p-1'
              mainDisplayImage={getMainDisplayImgUrl(s.imageUrls)}
              isListed
              sneaker={s}
              price={s.minPrice}
              onClick={onClick}
              lazyLoad
              key={idx}
            />
          );
        })}
      </Row>
    </Container>
  );
};

export default SneakerGallery;
