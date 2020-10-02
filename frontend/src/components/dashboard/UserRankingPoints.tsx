import React, {  } from 'react';
import StatisticsDisplay from './StatisticsDisplay';

type UserRankingPointsProps = {
  rankingPoints: number;
};

const UserRankingPoints = (props: UserRankingPointsProps) => (
  <StatisticsDisplay
    iconColor='icon-primary'
    iconName='objects_spaceship'
    primaryText={props.rankingPoints}
    secondaryText='Ranking Points'
  />
);

export default UserRankingPoints;
