import { useState } from 'react';

const useOpenCloseComp = () => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const toggle = () => setOpen(!open);

  return { open, onOpen, onClose, toggle };
};

export default useOpenCloseComp;
