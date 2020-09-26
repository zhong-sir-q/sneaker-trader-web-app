import React from 'react';
import StatisticsDisplay from './StatisticsDisplay';

type ListedSneakerCountsProps = {
  counts: number;
};

const ListedSneakerCounts = (props: ListedSneakerCountsProps) => (
  <StatisticsDisplay
    iconColor='icon-info'
    iconName='files_paper'
    primaryText={props.counts}
    secondaryText='Listed Sneakers'
  />
);

export default ListedSneakerCounts;
