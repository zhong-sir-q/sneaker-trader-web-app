import React from 'react';
import { CardBody, Card, CardHeader, CardTitle } from 'reactstrap';
import { Line } from 'react-chartjs-2';

import moment from 'moment';

import gradientChartOptionsConfig from './gradientChartOptionsConfig';

// returns an array of strings that have the month name and the year
const last12MonthYearLabels = () => {
  let time = moment();
  const result = Array<string>();

  for (let _i = 0; _i < 12; _i++) {
    let m = time.month();
    let y = time.year();

    // a quick fix, when moment subtracts going from January to December,
    // formating will yield invalid date, here we mannually wrap it to
    // December and decrement the year
    if (m === 0) {
      m = 12;
      y--;
    }

    // year has to come before month
    const labelDate = new Date(`${y} ${m}`);
    const label = moment(labelDate).format('YYYY MMM');
    result.push(label);

    time = time.subtract(1, 'M');
  }

  // reverse so the latest date comes last, so it will show up
  // on the rightmost of the graph
  return result.reverse();
};

const monthlyProfitConfig = (mothlyCumProfit: number[]) => ({
  data: (canvas: any) => {
    const ctx = canvas.getContext('2d');

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0)');
    gradientFill.addColorStop(1, 'rgba(249, 99, 59, 0.40)');

    return {
      // currently the label is fixed to be the last 12 months, but
      // we would like to apply day ranges to it in the future
      labels: last12MonthYearLabels(),
      datasets: [
        {
          label: '$',
          borderColor: '#f96332',
          pointBorderColor: '#FFF',
          pointBackgroundColor: '#f96332',
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: mothlyCumProfit,
        },
      ],
    };
  },
  options: gradientChartOptionsConfig,
});

type MonthlyProfitProps = {
  monthlyCumProfit: number[];
};

const MonthlyProfit = (props: MonthlyProfitProps) => {
  const config = monthlyProfitConfig(props.monthlyCumProfit);
  const { data, options } = config;

  return (
    <Card className='card-chart'>
      <CardHeader>
        <h5 className='card-category'>Monthly</h5>
        <CardTitle tag='h3'>Profit</CardTitle>
      </CardHeader>
      <CardBody>
        <div className='chart-area'>
          <Line data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default MonthlyProfit;
