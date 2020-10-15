import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import { CreatePoliLinkPayload } from '../../../../shared';
import formatRequestOptions from 'utils/formatRequestOptions';

class PoliController {
  poliPath: string;

  constructor() {
    this.poliPath = formatApiEndpoint('poli');
  }

  // return the created url as the response
  createPoliLink = (poliLinkReq: CreatePoliLinkPayload): Promise<string> =>
    fetch(concatPaths(this.poliPath, 'poliLink', 'create'), formatRequestOptions(poliLinkReq)).then((r) => r.json());
}

const PoliControllerInstance = new PoliController();

export default PoliControllerInstance;
