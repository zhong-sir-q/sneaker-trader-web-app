import React from 'react';
import { GallerySneaker } from '../../../shared';
import SneakerCard from './SneakerCard';

import { getMainDisplayImgUrl } from 'utils/utils';
import { useHistory } from 'react-router-dom';
import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';
import usePagination from 'hooks/usePagination';
import styled from 'styled-components';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1em;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0;
  }
`;

const Wrapper = styled.div``

const SneakerGallery = (props: SneakerGalleryProps) => {
  const history = useHistory();
  const { startRowCount, endRowCount, PaginationComponent } = usePagination(props.sneakers.length, 15);

  return (
    <Wrapper>
      <Grid data-testid='market-place-gallery'>
        {props.sneakers.slice(startRowCount(), endRowCount()).map((s, idx) => {
          const onClick = () => redirectBuySneakerPage(history, s.name, s.colorway);

          return (
            <SneakerCard
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
      </Grid>
      <div className='flex justify-center'>
        <PaginationComponent />
      </div>
    </Wrapper>
  );
};

export default SneakerGallery;
