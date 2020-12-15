import React from 'react';

import { ContactButton } from './StyledButton';

type ContactCustomerButtonProps = {
  title: string;
  onClick: () => void;
};

const ContactCustomerButton = (props: ContactCustomerButtonProps) => {
  const { title, onClick } = props;

  return (
    <ContactButton onClick={onClick}>
      {title}
      {/* {unreadMessageIds.length !== 0 ? <span className='notify'></span> : null} */}
    </ContactButton>
  );
};

export default ContactCustomerButton;
