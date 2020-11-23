import { Address } from '../../../../shared';
import { AddressController } from 'api/controllers/AddressController';

const onVerifyAddress = (AddressControllerInstance: AddressController) => async (userId: number, addr: Address) => {
  await AddressControllerInstance.addUserAddress(userId, addr);
  await AddressControllerInstance.generateVerificationCode(userId);
  await AddressControllerInstance.onSuccessGenerateCode(userId);
};

export default onVerifyAddress;
