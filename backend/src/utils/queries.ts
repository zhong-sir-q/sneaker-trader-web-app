// selcect the sellerId for the where clause
export const getSellersAvgRatingQuery = (ratingNameAlias: string, whereClause?: string) => `
  SELECT ROUND(AVG(sellerRatingFromBuyer), 1) as ${ratingNameAlias}, 
    sellerId FROM Transactions ${whereClause || 'GROUP BY sellerId'}`;

// selcect the buyerId for the where clause
export const getBuyersAvgRatingQuery = (ratingNameAlias: string, whereClause?: string) => `
  SELECT ROUND(AVG(buyerRatingFromSeller), 1) as ${ratingNameAlias}, 
    buyerId FROM Transactions ${whereClause || 'GROUP BY buyerId'}
`;
