import React, { ReactNode } from 'react';

type PanelHeaderProps = {
  content?: ReactNode;
  size?: 'sm' | 'lg';
};

const PanelHeader = (props: PanelHeaderProps) => (
  <div className={'panel-header ' + (props.size !== undefined ? 'panel-header-' + props.size : '')}>
    {props.content}
  </div>
);

export default PanelHeader;
