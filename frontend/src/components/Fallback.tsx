import React, { ReactNode } from 'react';

type FallbackProps = {
  fallback: boolean;
  fallbackComponent: ReactNode;
  children: ReactNode;
};

// Fallback renders the fallbackComponent is fallback is true
const Fallback = (props: FallbackProps) => {
  const { fallback, fallbackComponent, children } = props;

  return <React.Fragment>{fallback ? fallbackComponent : children}</React.Fragment>;
};

export default Fallback;
