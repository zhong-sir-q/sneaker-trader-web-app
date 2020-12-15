import { useRef, useEffect, useCallback, MutableRefObject } from 'react';

/**
 * @param deps : scroll to the bottom of the element whenever the dependency changes
 * @returns a html element ref
 */
const useScrollBottom = (...deps: any[]): [MutableRefObject<any>, () => void] => {
  const elementRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    if (elementRef.current) elementRef.current.scrollIntoView();
  }, [elementRef]);

  useEffect(() => {
    scrollToBottom();
  }, [...deps, elementRef, scrollToBottom]);

  return [elementRef, scrollToBottom];
};

export default useScrollBottom;
