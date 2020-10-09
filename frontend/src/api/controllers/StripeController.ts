import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';

export class StripeController {
  stripePath: string;

  constructor() {
    this.stripePath = formatApiEndpoint('stripe');
  }

  getClientSecret = (amountToCharge: number): Promise<string> =>
    fetch(concatPaths(this.stripePath, 'secret', amountToCharge)).then((r) => r.json());
}

const StripeControllerInstance = new StripeController();

export default StripeControllerInstance;
