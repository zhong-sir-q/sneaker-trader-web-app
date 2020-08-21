import React, { useState } from 'react';

// reactstrap components
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Button,
} from 'reactstrap';

// core components
import bgImage from 'assets/img/bg16.jpg';

type SignUpFormFocus = {
  firstname: boolean;
  lastname: boolean;
  phone: boolean;
  email: boolean;
  password: boolean;
};

const INIT_FOCUS_STATE: SignUpFormFocus = {
  firstname: false,
  lastname: false,
  phone: false,
  email: false,
  password: false,
};

// TODO: the signup form should contain the gender and date of birth
const SignUp = () => {
  const [focus, setFocus] = useState<SignUpFormFocus>(INIT_FOCUS_STATE);

  return (
    <>
      <div className="content">
        <div className="register-page">
          <Container>
            <Row className="justify-content-center">
              <Col lg={5} md={8} xs={12}>
                <div className="info-area info-horizontal mt-5">
                  <div className="icon icon-primary">
                    <i className="now-ui-icons media-2_sound-wave" />
                  </div>
                  <div className="description">
                    <h5 className="info-title">Marketing</h5>
                    <p className="description">
                      We've created the marketing campaign of the website. It was a very interesting collaboration.
                    </p>
                  </div>
                </div>
                <div className="info-area info-horizontal">
                  <div className="icon icon-primary">
                    <i className="now-ui-icons media-1_button-pause" />
                  </div>
                  <div className="description">
                    <h5 className="info-title">Fully Coded in React 16</h5>
                    <p className="description">
                      We've developed the website with React 16, HTML5 and CSS3. The client has access to the code using GitHub.
                    </p>
                  </div>
                </div>
                <div className="info-area info-horizontal">
                  <div className="icon icon-info">
                    <i className="now-ui-icons users_single-02" />
                  </div>
                  <div className="description">
                    <h5 className="info-title">Built Audience</h5>
                    <p className="description">There is also a Fully Customizable CMS Admin Dashboard for this product.</p>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={8} xs={12}>
                <Card className="card-signup">
                  <CardHeader className="text-center">
                    <CardTitle tag="h4">Register</CardTitle>
                    <div className="social btns-mr-5">
                      <Button className="btn-icon btn-round" color="twitter">
                        <i className="fab fa-twitter" />
                      </Button>
                      <Button className="btn-icon btn-round" color="dribbble">
                        <i className="fab fa-dribbble" />
                      </Button>
                      <Button className="btn-icon btn-round" color="facebook">
                        <i className="fab fa-facebook-f" />
                      </Button>
                      <h5 className="card-description">or be classical</h5>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <InputGroup className={focus.firstname ? 'input-group-focus' : ''}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons users_circle-08" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="First Name..."
                          onFocus={() => setFocus({ ...focus, firstname: true })}
                          onBlur={() => setFocus({ ...focus, firstname: false })}
                        />
                      </InputGroup>
                      <InputGroup className={focus.lastname ? 'input-group-focus' : ''}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons text_caps-small" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Last Name..."
                          onFocus={() => setFocus({ ...focus, lastname: true })}
                          onBlur={() => setFocus({ ...focus, lastname: false })}
                        />
                      </InputGroup>
                      <InputGroup className={focus.email ? 'input-group-focus' : ''}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email..."
                          onFocus={() => setFocus({ ...focus, email: true })}
                          onBlur={() => setFocus({ ...focus, email: false })}
                        />
                      </InputGroup>
                      <InputGroup className={focus.password ? 'input-group-focus' : ''}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password..."
                          onFocus={() => setFocus({ ...focus, password: true })}
                          onBlur={() => setFocus({ ...focus, password: false })}
                        />
                      </InputGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="checkbox" />
                          <span className="form-check-sign" />
                          <div>
                            I agree to the <a href="#policy">terms and conditions</a>.
                          </div>
                        </Label>
                      </FormGroup>
                    </Form>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button color="primary" size="lg" className="btn-round" href="#dashboard">
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <div className="full-page-background" style={{ backgroundImage: 'url(' + bgImage + ')' }} />
    </>
  );
};

export default SignUp;
