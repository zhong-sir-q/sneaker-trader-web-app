import AddressService from '../../services/AddressService';
import AddressVerificationCodeService from '../../services/AddressVerificationCodeService';

import faker from 'faker';

import fakeAddress from '../../__mocks__/fakeAddress';

// mock pool connection
jest.mock('../../config/mysql', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({ query: jest.fn(), close: jest.fn() }),
}));

const addrVerificationService = new AddressVerificationCodeService();
const addrService = new AddressService(addrVerificationService);

// FIXME: this test is extremely slow, profile it to debug where went wrong
describe('Address verification service', () => {
  test('Update verification status if code is validated', async (done) => {
    const spyOnValidateCode = jest.spyOn(addrVerificationService, 'validateCode').mockResolvedValue(true);
    const spyOnGetAddressByUserId = jest.spyOn(addrService, 'getAddressByUserId').mockResolvedValue(fakeAddress());
    const spyOnUpdateVerificationStatus = jest.spyOn(addrService as any, 'updateVerificationStatus').mockImplementation(jest.fn());

    await addrService.validateCodeByUserID(faker.random.number(), faker.random.number());

    expect(spyOnValidateCode).toBeCalledTimes(1);
    expect(spyOnGetAddressByUserId).toBeCalledTimes(1);
    expect(spyOnUpdateVerificationStatus).toBeCalledTimes(1);

    done();
  });
});
