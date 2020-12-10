import React from 'react';
import './NotFoundStyle.css';
import { Link } from 'react-router-dom';
import { HOME } from 'routes';

import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: rgb(149, 194, 222);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFound = () => {
  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default NotFound;
