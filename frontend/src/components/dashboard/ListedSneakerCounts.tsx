import React, { useState, useEffect } from 'react';
import StatisticsDisplay from './StatisticsDisplay';
import ListedSneakerControllerInstance from 'api/ListedSneakerController';
import { useAuth } from 'providers/AuthProvider';

const ListedSneakerCounts = () => {
  const [counts, setCounts] = useState<number>(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const sellerListedSneakers = await ListedSneakerControllerInstance.getUnsoldListedSneakers(currentUser.id);
        setCounts(sellerListedSneakers.length);
      }
    })();
  });

  return (
    <StatisticsDisplay
      iconColor='icon-info'
      iconName='files_paper'
      primaryText={counts}
      secondaryText='Listed Sneakers'
    />
  );
};

export default ListedSneakerCounts;
