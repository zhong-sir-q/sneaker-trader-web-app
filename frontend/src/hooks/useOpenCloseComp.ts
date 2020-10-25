import { useState } from 'react';

const useOpenCloseComp = (initState?: boolean) => {
  const [open, setOpen] = useState(initState || false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const toggle = () => setOpen(!open);

  return { open, onOpen, onClose, toggle };
};

export default useOpenCloseComp;
