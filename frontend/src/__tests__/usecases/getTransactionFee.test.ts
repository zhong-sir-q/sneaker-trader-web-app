import getTransactionFees from 'usecases/getTransactionFee';

test('Calculate transaction fees', () => {
  const transactionFeeOne = getTransactionFees(235)
  expect(transactionFeeOne).toBe(23.5)

  const transactionFeeTwo = getTransactionFees(44211)
  expect(transactionFeeTwo).toBe(4421.1)

  const transactionFeeThree = getTransactionFees(200)
  expect(transactionFeeThree).toBe(20)
});
