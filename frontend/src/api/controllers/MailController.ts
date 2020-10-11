import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';
import { MailAfterPurchasePayload } from '../../../../shared';
import formatRequestOptions from 'api/formatRequestOptions';

export class MailController {
  mailPath: string;

  constructor() {
    this.mailPath = formatApiEndpoint('mail');
  }

  mailOnConfirmPurchase = (payload: MailAfterPurchasePayload): Promise<any> =>
    fetch(concatPaths(this.mailPath, 'confirmPurchase'), formatRequestOptions(payload));
}

const MailControllerInstance = new MailController();

export default MailControllerInstance;
