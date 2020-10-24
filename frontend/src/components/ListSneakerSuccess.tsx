import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody, CardText, CardFooter, Button } from 'reactstrap';

import { ADMIN, DASHBOARD } from 'routes';

const ListedSneakerSuccess = () => (
  <Card>
    <CardHeader>
      <CardTitle tag='h4'>Congratulations, you successfully listed the sneakers!!!</CardTitle>
    </CardHeader>
    <CardBody>
      <CardText>CUSTOM SUCCESS MESSAGE GOES HERE</CardText>
    </CardBody>
    <CardFooter>
      <Link style={{ color: 'white' }} to={ADMIN + DASHBOARD}>
        <Button color='primary'>Back to dashboard</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default ListedSneakerSuccess;
