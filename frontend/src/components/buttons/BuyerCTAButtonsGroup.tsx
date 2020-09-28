import React, { useState, useEffect } from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';

import { SneakerStatus, Customer } from '../../../../shared';
import TransactionControllerInstance from 'api/controllers/TransactionController';

type BuyerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  seller: Customer;
};

const BuyerCTAButtonsGroup = (props: BuyerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, seller } = props;

  const [hasBuyerRatedSeller, setHasBuyerRatedSeller] = useState(true);

  useEffect(() => {
    (async () => setHasBuyerRatedSeller(await TransactionControllerInstance.hasBuyerRatedSeller(listedProdId)))();
  });

  const onCompelteRating = async (listedProductId: number, rating: number, comment: string) => {
    TransactionControllerInstance.rateSeller(listedProductId, rating, comment);
    setHasBuyerRatedSeller(true);
  };

  switch (prodStatus) {
    case 'pending':
      return (
        <div className='flex margin-right-except-last'>
          <ContactCustomerButton customer={seller} title='Contact Seller' />
        </div>
      );
    case 'sold':
      return (
        <div className='flex margin-right-except-last'>
          <ContactCustomerButton customer={seller} title='Contact Seller' />
          {!hasBuyerRatedSeller && (
            <RateCustomer title='Rate Seller' listedProductId={listedProdId} rateUser={onCompelteRating} />
          )}
        </div>
      );
    default:
      return null;
  }
};

export default BuyerCTAButtonsGroup;
