import React, { useState } from 'react';

import { CarouselItem, Carousel, CarouselControl } from 'reactstrap';

type SneakerCarouselProps = {
  imgUrlItems: string[];
};

const SneakerCarousel = (props: SneakerCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const { imgUrlItems } = props;

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === imgUrlItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? imgUrlItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = imgUrlItems.map((url, idx) => {
    return (
      <CarouselItem onExiting={() => setAnimating(true)} onExited={() => setAnimating(false)} key={idx}>
        <img style={{ width: '100%' }} src={url} alt={url} />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      {slides}
      <CarouselControl direction='prev' directionText='Previous' onClickHandler={previous} />
      <CarouselControl direction='next' directionText='Next' onClickHandler={next} />
    </Carousel>
  );
};

export default SneakerCarousel;
