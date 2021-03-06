import MailControllerInstance from 'api/controllers/MailController';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import TransactionControllerInstance from 'api/controllers/TransactionController';
import WalletControllerInstance from 'api/controllers/WalletController';
import UserControllerInstance from 'api/controllers/UserController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import AwsControllerInstance from 'api/controllers/AwsController';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import AddressControllerInstance from 'api/controllers/AddressController';
import UserRegistrationControllerInstance from 'api/controllers/UserRegistrationController';

jest.mock('api/controllers/MailController');
jest.mock('api/controllers/ListedSneakerController');
jest.mock('api/controllers/TransactionController');
jest.mock('api/controllers/WalletController');
jest.mock('api/controllers/UserController');
jest.mock('api/controllers/HelperInfoController');
jest.mock('api/controllers/AwsController');
jest.mock('api/controllers/SneakerController');
jest.mock('api/controllers/AddressController');
jest.mock('');

export const MockAwsControllerInstance = AwsControllerInstance;
export const MockMailControllerInstance = MailControllerInstance;
export const MockListedSneakerControllerInstance = ListedSneakerControllerInstance;
export const MockTransactionControllerInstance = TransactionControllerInstance;
export const MockWalletControllerInstance = WalletControllerInstance;
export const MockUserControllerInstance = UserControllerInstance;
export const MockRegistrationControllerInstance = UserRegistrationControllerInstance;
export const MockHelperInfoControllerInstance = HelperInfoControllerInstance;
export const MockSneakerControllerInstance = SneakerControllerInstance;
export const MockAddressControllerInstance = AddressControllerInstance;
