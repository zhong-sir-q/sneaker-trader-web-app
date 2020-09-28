interface WalletEntity {
  getBalanceByUserId(userId: number): Promise<number>;
  topup(userId: number, amount: number): Promise<any>;
  decreaseBalance(userId: number, amount: number): Promise<any>;
  create(userId: number): Promise<any>;
  delete(userId: number): Promise<any>;
}

export default WalletEntity;
