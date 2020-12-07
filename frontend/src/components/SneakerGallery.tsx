import React from 'react';
import { GallerySneaker } from '../../../shared';

import { getMainDisplayImgUrl } from 'utils/utils';
import { useHistory } from 'react-router-dom';
import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';
import usePagination from 'hooks/usePagination';
import styled from 'styled-components';
import FixedAspectRatioSneakerCard from './FixedAspectRatioSneakerCard';

type SneakerGalleryProps = {
  sneakers: GallerySneaker[];
};

const Flexbox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Wrapper = styled.div``;

const SneakerGallery = (props: SneakerGalleryProps) => {
  const history = useHistory();
  const { startRowCount, endRowCount, PaginationComponent } = usePagination(props.sneakers.length, 15);

  return (
    <Wrapper>
      <Flexbox data-testid='market-place-gallery'>
        {props.sneakers.slice(startRowCount(), endRowCount()).map((s, idx) => {
          const onClick = () => redirectBuySneakerPage(history, s.name, s.colorway);

          return (
            <CardWrapper key={idx}>
              <FixedAspectRatioSneakerCard
                mainDisplayImage={getMainDisplayImgUrl(s.imageUrls)}
                isListed
                sneaker={s}
                price={s.minPrice}
                onClick={onClick}
                lazyLoad
                key={idx}
              />
            </CardWrapper>
          );
        })}
      </Flexbox>
      <div className='flex justify-center'>
        <PaginationComponent />
      </div>
    </Wrapper>
  );
};

const CardWrapper = styled.div`
  flex: 0 0 33%;
  padding: 8px;

  @media (max-width: 1024px) {
    flex: 0 0 50%;
    padding: 4px;
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export default SneakerGallery;
