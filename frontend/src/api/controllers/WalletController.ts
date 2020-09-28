import WalletEntity from '../../../../shared/@types/domains/entities/WalletEntity';
import formatApiEndpoint, { concatPaths } from 'api/formatApiEndpoint';
import { TopupWalletPayload, DecreaseWalletPayload } from '../../../../shared';
import formatRequestOptions from 'api/formatRequestOptions';

class WalletController implements WalletEntity {
  walletPath: string;

  constructor() {
    this.walletPath = formatApiEndpoint('wallet');
  }

  create = (userId: number): Promise<any> =>
    fetch(concatPaths(this.walletPath, userId), formatRequestOptions(undefined, undefined, 'POST')).then((r) =>
      r.json()
    );

  delete = (userId: number) =>
    fetch(concatPaths(this.walletPath, userId), formatRequestOptions(undefined, undefined, 'DELETE')).then((r) =>
      r.json()
    );

  getBalanceByUserId = (userId: number): Promise<number> =>
    fetch(concatPaths(this.walletPath, userId)).then((res) => res.json());

  async topup(userId: number, amount: number) {
    const data: TopupWalletPayload = { userId, amount };

    return fetch(concatPaths(this.walletPath, 'topup'), formatRequestOptions(data, undefined, 'PUT')).then((r) =>
      r.json()
    );
  }

  async decreaseBalance(userId: number, amount: number) {
    const data: DecreaseWalletPayload = { userId, amount };

    return fetch(
      concatPaths(this.walletPath, 'decreaseBalance'),
      formatRequestOptions(data, undefined, 'PUT')
    ).then((r) => r.json());
  }
}

const WalletControllerInstance = new WalletController();

export default WalletControllerInstance;
