import { Address } from '..';

export interface AddressEntity {
  getAddressByUserId(userId: number): Promise<Address | null>;
  validateCodeByUserID(userId: number, code: number): Promise<boolean>;
  generateAndUpdateVerifcationCode(userId: number): Promise<void>;
  updateAddressByUserId(userId: number, addr: Address): Promise<void>;
  addUserAddress(userId: number, addr: Address): Promise<void>;
}
