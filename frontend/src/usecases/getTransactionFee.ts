const roundTwoDecimalPlaces = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

const getTransactionFees = (price: number) => roundTwoDecimalPlaces(price * 0.1)

export default getTransactionFees;
