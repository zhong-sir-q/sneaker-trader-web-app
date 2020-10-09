import WalletControllerInstance from 'api/controllers/WalletController';
import checkUserWalletBalance from 'usecases/checkUserWalletBalance';

import { useHistory } from 'react-router-dom';

jest.mock('../../api/controllers/WalletController');
jest.mock('react-router-dom');

describe('', () => {
  const history = useHistory();
  checkUserWalletBalance(-1, history);

  expect(WalletControllerInstance.getBalanceByUserId).toBeCalledTimes(1);
});
