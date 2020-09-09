import React, { useEffect, useRef } from 'react';

type OutsideClickHandlerProps = {
  handler: () => void;
  children: React.ReactNode;
};

const OutsideClickHandler = (props: OutsideClickHandlerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { handler, children } = props;

  const handleOutsideClick = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current!.contains(e.target as Node)) handler()
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  });

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideClickHandler;
