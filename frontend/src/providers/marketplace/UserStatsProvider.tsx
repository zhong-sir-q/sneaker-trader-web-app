import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

import { useAuth } from 'providers/AuthProvider';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import UserControllerInstance from 'api/controllers/UserController';
import TransactionControllerInstance from 'api/controllers/TransactionController';
import formatMonthlyProfit from 'usecases/formatMonthlyProfit';

type UserStatsCtxType = {
  rankingPoints: number | undefined;
  listedSneakerCounts: number | undefined;
  completedSaleCounts: number | undefined;
  monthlyCumProfit: number[] | undefined;
};

const INIT_CTX: UserStatsCtxType = {
  rankingPoints: undefined,
  listedSneakerCounts: undefined,
  completedSaleCounts: undefined,
  monthlyCumProfit: undefined,
};

const UserStatsCtx = createContext(INIT_CTX);

export const useUserStatsCtx = () => useContext(UserStatsCtx);

const UserStatsProvider = (props: { children: ReactNode }) => {
  const [rankingPoints, setRankingPoint] = useState<number>();
  const [listedSneakerCounts, setListedSneakerCounts] = useState<number>();
  const [completedSaleCounts, setCompletedSaleCounts] = useState<number>();
  const [monthlyCumProfit, setMonthlyCumProfit] = useState<number[]>();

  const { currentUser } = useAuth();

  useEffect(() => {
    const onLoaded = async () => {
      if (currentUser) {
        const sellerListedSneakers = await ListedSneakerControllerInstance.getUnsoldListedSneakers(currentUser.id);
        const soldSneakers = await ListedSneakerControllerInstance.getSoldListedSneakers(currentUser.id);
        const userRankingPoints = await UserControllerInstance.getRankingPointsByUserId(currentUser.id);
        const monthlyProfit = await TransactionControllerInstance.getCumMonthlyProfit(currentUser.id);

        setListedSneakerCounts(sellerListedSneakers.length);
        setCompletedSaleCounts(soldSneakers.length);
        setRankingPoint(userRankingPoints);
        setMonthlyCumProfit(formatMonthlyProfit(monthlyProfit));
      }
    };

    onLoaded();
  }, [currentUser]);

  return (
    <UserStatsCtx.Provider value={{ rankingPoints, listedSneakerCounts, completedSaleCounts, monthlyCumProfit }}>
      {props.children}
    </UserStatsCtx.Provider>
  );
};

export default UserStatsProvider;
