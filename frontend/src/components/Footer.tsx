import React from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { PRIVACY_POLICY, TERMS } from 'routes';

type FooterProps = {
  default: boolean;
  fluid: boolean;
};

const Footer = (props: FooterProps) => (
  <footer className={'footer' + (props.default ? ' footer-default' : '')}>
    <Container fluid={props.fluid}>
      <nav>
        <ul>
          <li>
            <a href='/' className='mr-4-px' target='_blank'>
              Sneaker Trader
            </a>
          </li>
          <li>
            <a href='#About Us' className='mr-4-px' target='_blank'>
              About Us
            </a>
          </li>
          <li>
            <Link to={PRIVACY_POLICY}>Privacy Policy</Link>
          </li>
          <li>
            <Link to={TERMS}>Terms and Conditions</Link>
          </li>
        </ul>
      </nav>
      <div className='copyright'>&copy; All rights reserved by Sneaker Trader, {new Date().getFullYear()}.</div>
    </Container>
  </footer>
);

export default Footer;
