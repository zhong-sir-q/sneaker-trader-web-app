import React, { FunctionComponent } from 'react';
import { Container } from 'reactstrap';

interface FooterProps {
  default: boolean;
  fluid: boolean;
}

const Footer: FunctionComponent<FooterProps> = (props) => (
  <footer className={'footer' + (props.default ? ' footer-default' : '')}>
    <Container fluid={props.fluid}>
      <nav>
        <ul>
          <li>
            <a href="#Home" className="mr-4-px" target="_blank">
              Sneaker Trader
            </a>
          </li>
          <li>
            <a href="#About Us" className="mr-4-px" target="_blank">
              About Us
            </a>
          </li>
          <li>
            <a href="#Blog" target="_blank">
              Blog
            </a>
          </li>
        </ul>
      </nav>
      <div className="copyright">&copy; All rights reserved by Sneaker Trader, {new Date().getFullYear()}.</div>
    </Container>
  </footer>
);

export default Footer;
