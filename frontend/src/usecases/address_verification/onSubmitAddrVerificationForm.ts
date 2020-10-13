import { AddressController } from 'api/controllers/AddressController';
import { Address } from '../../../../shared';

import onVerifyAddress from './onVerifyAddress';
import updateAddress from './updateAddress';

const onSubmitAddrVerificationForm = (
  AddressControllerInstance: AddressController,
  updateAddressCb: () => void
) => async (userId: number, formAddressValues: Address) => {
  switch (formAddressValues.verificationStatus) {
    case 'in_progress':
      return;
    case 'not_verified':
      await onVerifyAddress(AddressControllerInstance)(userId, formAddressValues);
      return;
    case 'verified':
      await updateAddress(AddressControllerInstance, updateAddressCb)(userId, formAddressValues);
      return;
    default:
      throw new Error('Invalid address verification status');
  }
};

export default onSubmitAddrVerificationForm;
