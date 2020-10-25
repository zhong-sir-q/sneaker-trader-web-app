import { makeStyles } from "@material-ui/core";

const useMuiCloseButtonStyle = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    outline: 'none',
  },
}));

export default useMuiCloseButtonStyle
