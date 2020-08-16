import { makeDeepCopy } from ".";
import { DbSneaker } from "../../../shared";

export const formatSneakerMetaData = (shoe: DbSneaker) => {
  const sneakerMetaData = makeDeepCopy(shoe);
  // the name and description are passed by argument
  // to create the product so it is not needed here
  delete sneakerMetaData.name;
  delete sneakerMetaData.description;

  return sneakerMetaData;
};

export const formatDbSneaker = (shoe: DbSneaker, productId: string, priceId: string) => {
  const dbSneaker = makeDeepCopy(shoe);
  dbSneaker['id'] = productId;
  dbSneaker['price_id'] = priceId;

  return dbSneaker;
};
