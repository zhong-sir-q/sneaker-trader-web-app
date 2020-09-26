import React from 'react';
import StatisticsDisplay from './StatisticsDisplay';

type SoldSneakerCountsProps = {
  counts: number;
};

const SoldSneakerCounts = (props: SoldSneakerCountsProps) => (
  <StatisticsDisplay
    iconColor='icon-danger'
    iconName='business_money-coins'
    primaryText={props.counts}
    secondaryText='Completed Sales'
  />
);

export default SoldSneakerCounts;
