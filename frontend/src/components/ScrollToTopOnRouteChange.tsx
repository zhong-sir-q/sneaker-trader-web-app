import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

type ScrollToTopOnRouteChangeProps = {
  children: React.ReactNode;
};

const ScrollToTopOnRouteChange = (props: ScrollToTopOnRouteChangeProps) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => window.scrollTo(0, 0));

    return () => {
      unlisten();
    };
  }, [history]);

  return <div>{props.children}</div>;
};

export default ScrollToTopOnRouteChange;
