import React, { useState, useEffect } from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';
import { CompleteSaleButton } from './StyledButton';

import { SneakerStatus, Customer } from '../../../../shared';
import TransactionControllerInstance from 'api/TransactionController';

type SellerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  buyer: Customer;
  onCompleteSale: () => void;
};

const SellerCTAButtonsGroup = (props: SellerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, buyer, onCompleteSale } = props;

  // set to true so the rate button does not render initially straight away
  const [hasSellerRatedBuyer, setHasSellerRatedBuyer] = useState(true);

  useEffect(() => {
    (async () => setHasSellerRatedBuyer(await TransactionControllerInstance.hasSellerRatedBuyer(listedProdId)))();
  });

  const onCompleteRating = async (listedProductId: number, rating: number, comment: string) => {
    TransactionControllerInstance.rateBuyer(listedProductId, rating, comment);
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
            <RateCustomer title='Rate Buyer' listedProductId={listedProdId} rateUser={onCompleteRating} />
          )}
        </div>
      );
    default:
      return null;
  }
};

export default SellerCTAButtonsGroup;
