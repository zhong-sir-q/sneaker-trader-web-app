import { useRef, useEffect } from 'react';

/**
 * @param deps : scroll to the bottom of the element whenever the dependency changes
 * @returns a html element ref
 */
const useScrollBottom = (...deps: any[]) => {
  const elementRef = useRef<HTMLElement>();

  useEffect(() => {
    const scrollToBottom = () => {
      if (elementRef.current) elementRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToBottom();
  }, [...deps, elementRef]);

  return elementRef;
};

export default useScrollBottom;
