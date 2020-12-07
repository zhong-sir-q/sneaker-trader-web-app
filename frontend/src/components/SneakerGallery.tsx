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
            <CardWrapper>
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
  width: 32%;
  margin-right: 8px;
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    width: 48%;
  }
`;

export default SneakerGallery;
