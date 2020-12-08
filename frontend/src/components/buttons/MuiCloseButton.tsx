import React from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import styled from 'styled-components';

// place the icon on the top-right corner
// of the closest relative parent component
const useMuiCloseButtonStyle = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    outline: 'none',
    padding: '4px',
    backgroundColor: 'black',
    color: 'white',
    // make the background color the same on hover
    '&:hover': {
      backgroundColor: 'black',
    },
  },
}));

type MuiCloseButtonProps = {
  onClick: () => void;
};

const MuiCloseButton = (props: MuiCloseButtonProps) => {
  const classes = useMuiCloseButtonStyle();

  return (
    <Wrapper onClick={props.onClick}>
      <IconButton className={classes.closeButton}>
        <Close />
      </IconButton>
    </Wrapper>
  );
};

// use a div because on iPhone SE, the close button does not work well
const Wrapper = styled.div``;

export default MuiCloseButton;
