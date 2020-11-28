import React from 'react';

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  makeStyles,
  Theme,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import defaultAvatar from 'assets/img/placeholder.jpg';

import { UserRankingRow } from '../../../shared';
import MuiCloseButton from './buttons/MuiCloseButton';

type UserRankingLeaderBoardItemProps = UserRankingRow & { placing: number };

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    secondaryActionRoot: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    itemTextRoot: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
  })
);

const UserRankingLeaderBoardItem = (props: UserRankingLeaderBoardItemProps) => {
  const { placing, username, rankingPoints, profilePicUrl } = props;

  const styles = useStyles();

  return (
    <ListItem divider>
      {/* <span style={{ width: '25px' }}>{placing}</span> */}
      <ListItemAvatar>
        <Avatar src={profilePicUrl || defaultAvatar} alt={`${username} profile pic`}></Avatar>
      </ListItemAvatar>
      <div>
        <ListItemText>
          {placing}. {username || 'No username'}
        </ListItemText>
        {/* show if width > 600px */}
        <ListItemSecondaryAction className={styles.secondaryActionRoot}>{rankingPoints} Points</ListItemSecondaryAction>

        {/* show if width < 600px */}
        <ListItemText className={styles.itemTextRoot}>{rankingPoints} Points</ListItemText>
      </div>
    </ListItem>
  );
};

type UserRankingLeaderBoardProps = {
  items: UserRankingRow[];
};

// TODO: make the leaderboard responsive on small screen
const UserRankingLeaderBoard = (props: UserRankingLeaderBoardProps) => (
  <List>
    {props.items.map((row, idx) => (
      <UserRankingLeaderBoardItem {...row} placing={idx + 1} key={idx} />
    ))}
  </List>
);

type UserRankingLeaderBoardDialogProps = {
  isDialogOpen: boolean;
  closeDialog: () => void;
  rankings: UserRankingRow[];
};

export const UserRankingLeaderBoardDialog = (props: UserRankingLeaderBoardDialogProps) => {
  const { isDialogOpen, closeDialog, rankings } = props;

  return (
    <Dialog fullWidth maxWidth='xs' open={isDialogOpen} onClose={closeDialog}>
      <DialogTitle>
        <MuiCloseButton onClick={closeDialog} />
      </DialogTitle>
      <DialogContent>
        <UserRankingLeaderBoard items={rankings} />
      </DialogContent>
    </Dialog>
  );
};

export default UserRankingLeaderBoard;
