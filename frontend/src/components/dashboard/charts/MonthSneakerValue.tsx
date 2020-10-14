import React from 'react';
import { Card, CardTitle, CardBody, CardHeader } from 'reactstrap';
import { Line } from 'react-chartjs-2';

import gradientChartOptionsConfig from './gradientChartOptionsConfig';
import hexToRGB from './hexToRGB';

const monthlySneakerValueMock = {
  data: (canvas: any) => {
    const ctx = canvas.getContext('2d');

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0)');
    gradientFill.addColorStop(1, hexToRGB('#18ce0f', 0.4));
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Email Stats',
          borderColor: '#18ce0f',
          pointBorderColor: '#FFF',
          pointBackgroundColor: '#18ce0f',
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

const MonthSneakerValue = () => {
  return (
    <Card className='card-chart'>
      <CardHeader>
        <h5 className='card-category'>Monthly</h5>
        <CardTitle tag='h3'>Sneaker Value</CardTitle>
      </CardHeader>
      <CardBody>
        <div className='chart-area'>
          <Line data={monthlySneakerValueMock.data} options={monthlySneakerValueMock.options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default MonthSneakerValue;
