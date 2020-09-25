import React from 'react';
import { CardBody, Card, CardHeader, CardTitle } from 'reactstrap';

import { Line } from 'react-chartjs-2'
import gradientChartOptionsConfig from './gradientChartOptionsConfig';

const monthlyProfitMock = {
  data: (canvas: any) => {
    var ctx = canvas.getContext('2d');

    var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0)');
    gradientFill.addColorStop(1, 'rgba(249, 99, 59, 0.40)');
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Active Users',
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
          data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630],
        },
      ],
    };
  },
  options: gradientChartOptionsConfig,
};

const MonthlyProfit = () => {
  return (
    <Card className='card-chart'>
      <CardHeader>
        <h5 className='card-category'>Monthly</h5>
        <CardTitle tag='h3'>Profit</CardTitle>
      </CardHeader>
      <CardBody>
        <div className='chart-area'>
          <Line data={monthlyProfitMock.data} options={monthlyProfitMock.options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default MonthlyProfit;
