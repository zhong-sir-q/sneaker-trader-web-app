import React from 'react';
import './NotFoundStyle.css';
import { Link } from 'react-router-dom';
import { HOME } from 'routes';

const NotFound = (): JSX.Element => {
  return (
    <div style={{ backgroundColor: '#95c2de', height: '100vh' }}>
      <div className='mainbox'>
        <div className='err'>4</div>
        <i className='far fa-question-circle fa-spin'></i>
        <div className='err2'>4</div>
        <div className='message'>
          Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?
          <p>
            Let&lsquo;s go <Link to={HOME}>home</Link> and try from there.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
