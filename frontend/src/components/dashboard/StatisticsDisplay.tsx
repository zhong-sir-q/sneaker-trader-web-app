import React from 'react';

type StatisticsDisplayProps = {
  iconColor: string;
  iconName: string;
  primaryText: string | number;
  secondaryText: string | number;
};

const StatisticsDisplay = (props: StatisticsDisplayProps) => {
  const { iconColor, iconName, primaryText, secondaryText } = props;

  return (
    <div className='statistics'>
      <div className='info'>
        <div className={`icon ${iconColor}`}>
          <i className={`now-ui-icons ${iconName}`} />
        </div>
        <h3 className='info-title'>{primaryText}</h3>
        <h6 className='stats-title'>{secondaryText}</h6>
      </div>
    </div>
  );
};

export default StatisticsDisplay;
