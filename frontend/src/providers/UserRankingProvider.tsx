import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserRankingRow } from '../../../shared';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import UserControllerInstance from 'api/controllers/UserController';
import { UserRankingLeaderBoardDialog } from 'components/UserRankingLeaderBoard';

type UserRankingType = {
  onOpenLeaderBoard: () => void;
};

const INIT_CTX: UserRankingType = {
  onOpenLeaderBoard: () => {
    throw new Error('Must override!');
  },
};

const UserRanking = createContext(INIT_CTX);

export const useUserRanking = () => useContext(UserRanking);

// tightly bound to the leaderboard component
const UserRankingProvider = (props: { children: ReactNode }) => {
  const { open, onClose, onOpen } = useOpenCloseComp();
  const [rankingRows, setRankingRows] = useState<UserRankingRow[]>([]);

  useEffect(() => {
    (async () => {
      const rows = await UserControllerInstance.getAllUserRankingPoints();
      setRankingRows(rows);
    })();
  }, []);

  return (
    <UserRanking.Provider value={{ onOpenLeaderBoard: onOpen }}>
      {props.children}
      <UserRankingLeaderBoardDialog isDialogOpen={open} closeDialog={onClose} rankings={rankingRows} />
    </UserRanking.Provider>
  );
};

export default UserRankingProvider;
