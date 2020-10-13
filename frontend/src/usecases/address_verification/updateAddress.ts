import { AddressController } from 'api/controllers/AddressController';
import { Address } from '../../../../shared';

const updateAddress = (AddressControllerInstance: AddressController, cb: () => void) => async (
  userId: number,
  address: Address
) => {
  await AddressControllerInstance.updateAddressByUserId(userId, address);
  cb();
};

export default updateAddress;
