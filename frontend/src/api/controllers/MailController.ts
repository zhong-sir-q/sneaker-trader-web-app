import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';

import { MailAfterPurchasePayload, User, NewRequestSneaker } from '../../../../shared';

import formatRequestOptions from 'utils/formatRequestOptions';

export class MailController {
  private mailPath: string;

  constructor() {
    this.mailPath = formatApiEndpoint('mail');
  }

  mailOnConfirmPurchase = (payload: MailAfterPurchasePayload): Promise<any> =>
    fetch(concatPaths(this.mailPath, 'confirmPurchase'), formatRequestOptions(payload));

  mailAdminAfterNewRequest = (payload: { user: User; listedSneaker: NewRequestSneaker }) =>
    fetch(concatPaths(this.mailPath, 'newSneakerRequest'), formatRequestOptions(payload));
}

const MailControllerInstance = new MailController();

export default MailControllerInstance;
