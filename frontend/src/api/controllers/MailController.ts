import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import { MailAfterPurchasePayload } from '../../../../shared';
import formatRequestOptions from 'utils/formatRequestOptions';

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
