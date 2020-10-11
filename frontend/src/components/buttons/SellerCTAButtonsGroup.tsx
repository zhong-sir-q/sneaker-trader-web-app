import React, { useState } from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';
import { CompleteSaleButton } from './StyledButton';

import { SneakerStatus, Buyer } from '../../../../shared';
import TransactionControllerInstance from 'api/controllers/TransactionController';

type SellerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  buyer: Buyer;
  onCompleteSale: () => void;
};

const SellerCTAButtonsGroup = (props: SellerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, buyer, onCompleteSale } = props;

  // DIRTY TRICK: update the state after the rating is completed to hide the RateCustomer
  // button, if this state is not used, I have to tell the parent to fetch all data in order to update
  // which will be very slow
  const [hasSellerRatedBuyer, setHasSellerRatedBuyer] = useState(buyer ? buyer.hasSellerRatedBuyer : 0)

  const onCompleteRating = async (listedProductId: number, rating: number, comment: string) => {
    await TransactionControllerInstance.rateBuyer(listedProductId, rating, comment);
    setHasSellerRatedBuyer(1)
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
