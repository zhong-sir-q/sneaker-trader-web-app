import React, { useState, useEffect } from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';
import { CompleteSaleButton } from './StyledButton';

import TransactionControllerInstance from 'api/TransactionController';

import { SneakerStatus, Customer } from '../../../../shared';

type SellerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  buyer: Customer;
  onCompleteSale: () => void;
};

const SellerCTAButtonsGroup = (props: SellerCTAButtonsGroupProps) => {
  const [hasSellerRatedBuyer, setHasSellerRatedBuyer] = useState(false);

  const { prodStatus, listedProdId, buyer, onCompleteSale } = props;

  useEffect(() => {
    (async () => setHasSellerRatedBuyer(await TransactionControllerInstance.hasSellerRatedBuyer(listedProdId)))();
  });

  const onCompelteRating = async (listedProductId: number, rating: number) => {
    TransactionControllerInstance.rateBuyer(listedProductId, rating);
    setHasSellerRatedBuyer(true);
  };

  switch (prodStatus) {
    case 'pending':
      return (
        <div className='flex margin-right-except-last'>
          <ContactCustomerButton customer={buyer} title='Contact Buyer' />
          <CompleteSaleButton onClick={onCompleteSale}>Complete Sale</CompleteSaleButton>
        </div>
      );
    case 'sold':
      return (
        <div className='flex margin-right-except-last'>
          <ContactCustomerButton customer={buyer!} title='Contact Buyer' />
          {!hasSellerRatedBuyer && (
            <RateCustomer title='Rate Buyer' listedProductId={listedProdId} rateUser={onCompelteRating} />
          )}
        </div>
      );
    default:
      return null;
  }
};

export default SellerCTAButtonsGroup;
