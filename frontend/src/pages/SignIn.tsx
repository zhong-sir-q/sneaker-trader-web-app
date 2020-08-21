import React, { useState } from 'react';

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from 'reactstrap';

// core components
import nowLogo from 'assets/img/now-logo.png';

import bgImage from 'assets/img/bg14.jpg';
import { SIGNUP, AUTH } from 'routes';

const SignIn = () => {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  return (
    <React.Fragment>
      <div className="content">
        <div className="login-page">
          <Container>
            <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
              <Form>
                <Card className="card-login card-plain">
                  <CardHeader>
                    <div className="logo-container">
                      <img src={nowLogo} alt="now-logo" />
                    </div>
                  </CardHeader>
                  <CardBody>
                    <InputGroup className={'no-border form-control-lg ' + (emailFocus ? 'input-group-focus' : '')}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="First Name..."
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                    </InputGroup>
                    <InputGroup className={'no-border form-control-lg ' + (passwordFocus ? 'input-group-focus' : '')}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Last Name..."
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                      />
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button block color="primary" size="lg" href="#pablo" className="mb-3 btn-round">
                      Get Started
                    </Button>
                    <div className="pull-left">
                      <h6>
                        <a href={AUTH + SIGNUP} className="link footer-link">
                          Create Account
                        </a>
                      </h6>
                    </div>
                    <div className="pull-right">
                      <h6>
                        <a href="#help" className="link footer-link">
                          Need Help?
                        </a>
                      </h6>
                    </div>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </div>
      <div className="full-page-background" style={{ backgroundImage: 'url(' + bgImage + ')' }} />
    </React.Fragment>
  );
};

export default SignIn;
