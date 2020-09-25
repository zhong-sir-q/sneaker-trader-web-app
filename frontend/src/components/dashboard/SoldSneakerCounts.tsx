import React, { useState, useEffect } from 'react';
import StatisticsDisplay from './StatisticsDisplay';
import ListedSneakerControllerInstance from 'api/ListedSneakerController';
import { useAuth } from 'providers/AuthProvider';

const SoldSneakerCounts = () => {
  const [counts, setCounts] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const soldSneakers = await ListedSneakerControllerInstance.getSoldListedSneakers(currentUser.id);
        setCounts(soldSneakers.length);
      }
    })();
  });

  return (
    <StatisticsDisplay
      iconColor='icon-danger'
      iconName='business_money-coins'
      primaryText={counts}
      secondaryText='Completed Sales'
    />
  );
};

export default SoldSneakerCounts;
