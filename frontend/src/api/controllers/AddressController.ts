import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';
import { AddressEntity, Address } from '../../../../shared';

import formatRequestOptions from 'api/formatRequestOptions';

class AddressController implements AddressEntity {
  addrPath: string;

  constructor() {
    this.addrPath = formatApiEndpoint('address');
  }

  addUserAddress = (userId: number, addr: Address): Promise<void> =>
    fetch(concatPaths(this.addrPath, userId), formatRequestOptions(addr, undefined, 'POST')).then((r) => r.json());

  getAddressByUserId = (userId: number): Promise<Address | null> =>
    fetch(concatPaths(this.addrPath, userId)).then((r) => r.json());

  validateCodeByUserID = (userId: number, code: number): Promise<boolean> =>
    fetch(
      concatPaths(this.addrPath, 'validateCode', userId),
      formatRequestOptions({ verificationCode: code }, undefined, 'POST')
    ).then((r) => r.json());

  generateAndUpdateVerifcationCode = (userId: number): Promise<void> =>
    fetch(
      concatPaths(this.addrPath, 'generateCode', userId),
      formatRequestOptions(undefined, undefined, 'PUT')
    ).then((r) => r.json());

  updateAddressByUserId = (userId: number, addr: Address): Promise<void> =>
    fetch(concatPaths(this.addrPath, userId), formatRequestOptions(addr, undefined, 'PUT')).then((r) => r.json());
}

const AddressControllerInstance = new AddressController();

export default AddressControllerInstance;
