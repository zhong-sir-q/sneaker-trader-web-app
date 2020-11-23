import React from 'react';
import { Container } from 'reactstrap';
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
            <a href='/' className='mr-4-px'>
              Sneaker Trader
            </a>
          </li>
          <li>
            <a href='#About Us' className='mr-4-px' target='_blank'>
              About Us
            </a>
          </li>
          <li>
            <a href={PRIVACY_POLICY}>Privacy Policy</a>
          </li>
          <li>
            <a href={TERMS}>Terms and Conditions</a>
          </li>
        </ul>
      </nav>
      <div className='copyright' data-testid='copyright'>
        &copy; All rights reserved by Sneaker Trader LTD, {new Date().getFullYear()}.
      </div>
    </Container>
  </footer>
);

export default Footer;
