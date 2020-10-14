import { MonthlyProfit } from '../../../shared';

const formatMonthlyProfit = (monthlyProfit: MonthlyProfit[]): number[] => {
  // each month has no profit initially, ignoring the first value
  const profits = Array(13).fill(0);

  for (const mp of monthlyProfit) profits[mp.transactionMonth] = mp.cumMonthlyProfit;

  // omit the first filler value
  return profits.slice(1)
};

export default formatMonthlyProfit;
