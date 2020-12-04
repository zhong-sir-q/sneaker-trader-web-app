import { AddressController } from 'api/controllers/AddressController';
import { Address } from '../../../../shared';

const updateAddress = (addressController: AddressController, cb: () => void) => async (
  userId: number,
  address: Address
) => {
  await addressController.updateAddressByUserId(userId, {
    ...address,
    updateVerificationDate: new Date().toISOString(),
  });

  await addressController.generateVerificationCode(userId);

  cb();
};

export default updateAddress;
