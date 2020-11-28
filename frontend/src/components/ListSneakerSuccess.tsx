import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardFooter, Button } from 'reactstrap';

import { ADMIN, DASHBOARD } from 'routes';

type ListedSneakerSuccessProps = {
  title: string;
};

const ListedSneakerSuccess = (props: ListedSneakerSuccessProps) => (
  <Card>
    <CardHeader>
      <CardTitle tag='h4'>{props.title}</CardTitle>
    </CardHeader>
    <CardFooter>
      <Link data-testid='listing-success-to-dashboard-link' style={{ color: 'white' }} to={ADMIN + DASHBOARD}>
        <Button color='primary'>Back to dashboard</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default ListedSneakerSuccess;
