import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody, CardText, CardFooter, Button } from 'reactstrap';

import { ADMIN, DASHBOARD } from 'routes';

const SubmissionSuccess = () => (
  <Card>
    <CardHeader>
      <CardTitle tag='h4'>Congratulations, you successfully listed the sneakers!!!</CardTitle>
    </CardHeader>
    <CardBody>
      <CardText>CUSTOM SUCCESS MESSAGE GOES HERE</CardText>
    </CardBody>
    <CardFooter>
      <Button color='primary'>
        <Link style={{ color: 'white' }} to={ADMIN + DASHBOARD}>
          Go back home
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

export default SubmissionSuccess;
