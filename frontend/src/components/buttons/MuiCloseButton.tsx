import React from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

// place the icon on the top-right corner
// of the closest relative parent component
const useMuiCloseButtonStyle = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    outline: 'none',
    padding: '3px',
    backgroundColor: 'black',
    color: 'white',
    // make the background color the same on hover
    '&:hover': {
      backgroundColor: 'black'
    }
  },
}));

type MuiCloseButtonProps = {
  onClick: () => void;
};

const MuiCloseButton = (props: MuiCloseButtonProps) => {
  const classes = useMuiCloseButtonStyle();

  return (
    <IconButton className={classes.closeButton} onClick={props.onClick}>
      <Close />
    </IconButton>
  );
};

export default MuiCloseButton;
