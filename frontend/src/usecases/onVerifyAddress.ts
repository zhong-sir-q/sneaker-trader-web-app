import { Address } from '../../../shared';
import AddressControllerInstance from 'api/controllers/AddressController';

const onVerifyAddress = async (userId: number, addr: Address) => {
  await AddressControllerInstance.addUserAddress(userId, addr);
  await AddressControllerInstance.generateAndUpdateVerifcationCode(userId);
  await AddressControllerInstance.onSuccessGenerateCode(userId);
};

export default onVerifyAddress;
