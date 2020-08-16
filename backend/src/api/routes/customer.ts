import { Router } from 'express';
import CustomerService from '../../services/customer';
import { getMysqlDb } from '../../config/mysql';
import stripe from '../../config/stripe';
import { FetchDbDataCallback } from '../../@types/utils';

const route = Router();

export default (app: Router) => {
  app.use('/customer', route);

  // if the customer does not already exists in db, then create a customer in stripe ->  create a user in the table
  route.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;

    const mysqlConnection = getMysqlDb();
    const CustomerServiceInstance = new CustomerService(mysqlConnection);

    const cb: FetchDbDataCallback = async (err, queryResult) => {
      if (err) next(err);

      if (!queryResult) {
        // this check may not be necessary, but use it just to be safe
        const createCustomerOption = typeof req.query.email === 'string' ? { email: req.query.email } : {};
        const customer = await stripe.customers.create(createCustomerOption);

        CustomerServiceInstance.create({ id: customer.id, userId });

        res.send(customer.id);
      } else res.send(queryResult);
    };

    CustomerServiceInstance.getCustomerId(userId, cb);
  });
};
