import { Router } from 'express';
import CustomerService from '../../services/customer';
import { getMysqlDb } from '../../config/mysql';

const route = Router();

export default (app: Router) => {
  app.use('/customer', route);

  route.get('/', (req, res, next) => {
    const customerId = req.query.id;
    const userId = req.query.userId

    const mysqlConnection = getMysqlDb();
    const CustomerServiceInstance = new CustomerService(req, res, next, mysqlConnection);

    if (customerId) CustomerServiceInstance.get(customerId as string);
    else if (userId) CustomerServiceInstance.getId(userId as string)
    else next(new Error('No query is specified for the customer route'))
  });

  route.post('/:id', (req, res, next) => {
    const customerId = req.params.id
    const userId = req.query.userId as string

    // NOTE: this type is already defined in src/components/Profile in frontend
    const customerProfile: { name: string, email: string, phone: string } = req.body
    
    // TODO: how do I avoid the repetitions of getting the database
    // connection and initializing the service instance in different routes
    const mysqlConnection = getMysqlDb()
    const CustomerServiceInstance = new CustomerService(req, res, next, mysqlConnection)
    CustomerServiceInstance.update(customerId, userId, customerProfile)
  })
};
