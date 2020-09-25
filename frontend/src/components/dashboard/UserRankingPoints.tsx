import React, { useEffect, useState } from 'react';
import StatisticsDisplay from './StatisticsDisplay';
import { useAuth } from 'providers/AuthProvider';

const UserRankingPoints = () => {
  const [rankingPoints, setRankingPoints] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) setRankingPoints(currentUser.rankingPoint);
  }, [currentUser]);

  return (
    <StatisticsDisplay
      iconColor='icon-primary'
      iconName='objects_spaceship'
      primaryText={rankingPoints}
      secondaryText='Ranking Points'
    />
  );
};

export default UserRankingPoints;
