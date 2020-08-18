import { Response, Request, NextFunction } from 'express';
import { Connection } from 'mysql';
import { Stripe } from 'stripe';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import config from '../config'
import stripe from '../config/stripe';
import { FetchDbDataCallback } from '../@types/utils';
import { formatInsertColumnsQuery, formatUpdateColumnsQuery } from '../utils/formatDbQuery';

// the keys of this type corresponds to the columns of the table
type CustomerIdentity = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
};

class CustomerService {
  connection: Connection;
  tableName: string;
  routeReq: Request<any>;
  routeRes: Response<any>;
  next: NextFunction;

  constructor(req: Request<any>, res: Response<any>, next: NextFunction, conn: Connection) {
    this.routeRes = res;
    this.routeReq = req;
    this.connection = conn;
    this.tableName = 'Customers';
    this.next = next;
  }

  // returns the name and the phone of a specific customer
  get(customerId: string) {
    const getCustomerQuery = `SELECT name, phone, email FROM ${this.tableName} WHERE id = ?`;
    this.connection.query(getCustomerQuery, customerId, (err, result) => {
      if (err) this.getCustomerCallback(err, undefined);
      else this.getCustomerCallback(undefined, result);
    });
  }

  getCustomerCallback: FetchDbDataCallback = (err, getCustomerQueryResult: { name: string; phone: string }[]) => {
    if (err) throw new Error(`Error getting the customer profile: ${err.message}`);
    this.routeRes.json({ profile: getCustomerQueryResult[0] });
  };

  create(identity: CustomerIdentity) {
    const createCustoerQuery = formatInsertColumnsQuery(this.tableName, identity);

    this.connection.query(createCustoerQuery, (err) => {
      if (err) throw new Error(`Error creating the user in the database: ${err.message}`);
    });
  }

  // NOTE: this type is already defined in src/components/Profile in frontend
  async update(id: string, userId: string, customerProfile: { name: string; email: string; phone: string }) {
    const updateCustomerQuery = formatUpdateColumnsQuery(this.tableName, customerProfile, `WHERE id = "${id}"`);
    const formatErrMessage = (err: Error, errOccurredLocation: string) =>
      `Error updating the customer profile in the ${errOccurredLocation}: ${err.message}`;

    // update the customer in the database
    this.connection.query(updateCustomerQuery, (err) => {
      if (err) this.next(new Error(formatErrMessage(err, 'database')));
    });

    // update the customer in stripe
    await stripe.customers
      .update(id, { name: customerProfile.name, email: customerProfile.email, phone: customerProfile.phone })
      .catch((err) => formatErrMessage(err, 'stripe'));

    // update the custoer in AWS Cognito
    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({ region: config.region });

    // NOTE: assmuing that all keys except for phone conforms to the naming of the UserAttributes in Cognito
    const formatUserAttributes = (obj: { [k: string]: string }): { Name: string; Value: string }[] => {
      if (obj.phone) {
        obj['phone_number'] = obj.phone;
        delete obj.phone;
      }

      return Object.entries(obj).map(([key, val]) => ({ Name: key, Value: val }));
    };

    const params: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
      UserAttributes: formatUserAttributes(customerProfile),
      UserPoolId: config.userPoolId,
      Username: userId,
    };

    cognitoidentityserviceprovider.adminUpdateUserAttributes(params, (err) => {
      if (err) this.next(err);
    });

    this.routeRes.send('Update was successful');
  }

  // pass the fetched data if any, to the callback function
  getId(userId: string) {
    // fetch the customerId using the userId
    const query = `SELECT id FROM ${this.tableName} WHERE userId = ?`;

    this.connection.query(query, userId, (err, data: { id: string }[]) => {
      if (err) this.getCustomerIdCallbak(userId)(err, undefined);
      // no customer id in respect to the user id
      if (!data[0]) this.getCustomerIdCallbak(userId)(undefined, undefined);
      else this.getCustomerIdCallbak(userId)(undefined, data[0].id);
    });
  }

  // if the customer does not already exists in db,
  // then create a customer in stripe -> create a user in the table
  getCustomerIdCallbak = (userId: string): FetchDbDataCallback => async (err, getCustomerIdQueryResult: string) => {
    if (err) this.next(err);
    if (!getCustomerIdQueryResult) {
      const email = this.routeReq.query.email as string;
      const name = this.routeReq.query.name as string;
      const phoneNumber = this.routeReq.query.phoneNumber as string;

      const createStripeCustomerParams: Stripe.CustomerCreateParams = {
        email,
        name,
        phone: phoneNumber,
      };

      const customer = await stripe.customers.create(createStripeCustomerParams);

      const createDbCustomerParams: CustomerIdentity = { id: customer.id, phone: phoneNumber, userId, name, email };

      this.create(createDbCustomerParams);

      this.routeRes.send(customer.id);
    } else this.routeRes.send(getCustomerIdQueryResult);
  };
}

export default CustomerService;
