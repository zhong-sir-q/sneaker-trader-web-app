import React, {  } from 'react';
import StatisticsDisplay from './StatisticsDisplay';

type UserRankingPointsProps = {
  rankingPoint: number;
};

const UserRankingPoints = (props: UserRankingPointsProps) => (
  <StatisticsDisplay
    iconColor='icon-primary'
    iconName='objects_spaceship'
    primaryText={props.rankingPoint}
    secondaryText='Ranking Points'
  />
);

export default UserRankingPoints;
