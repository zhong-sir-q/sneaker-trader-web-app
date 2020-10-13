import { AddressController } from 'api/controllers/AddressController';

const completeVerifyAddress = (
  AddressControllerInstance: AddressController,
  onFail: () => void,
  onSuccess: () => void
) => async (userId: number, code: number) => {
  const isValidCode = await AddressControllerInstance.validateCodeByUserID(userId, code);

  if (!isValidCode) {
    onFail();
    return;
  }

  onSuccess();
};

export default completeVerifyAddress;
