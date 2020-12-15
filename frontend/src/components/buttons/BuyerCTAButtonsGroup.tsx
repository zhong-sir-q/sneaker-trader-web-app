import React, { useState } from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';

import { SneakerStatus, Seller } from '../../../../shared';
import TransactionControllerInstance from 'api/controllers/TransactionController';

type BuyerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  seller: Seller;
  onContact: () => void;
};

const BuyerCTAButtonsGroup = (props: BuyerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, seller, onContact } = props;

  // DIRTY TRICK: update the state after the rating is completed to hide the RateCustomer
  // button, if this state is not used, I have to tell the parent to fetch all data in order to update
  // which will be very slow
  const [hasBuyerRatedSeller, setHasBuyerRatedSeller] = useState(seller ? seller.hasBuyerRatedSeller : 0)

  const onCompelteRating = async (listedProductId: number, rating: number, comment: string) => {
    await TransactionControllerInstance.rateSeller(listedProductId, rating, comment);
    setHasBuyerRatedSeller(1)
  };

  switch (prodStatus) {
    case 'pending':
      return (
        <div className='flex margin-right-except-last'>
          <ContactCustomerButton title='Contact Seller' onClick={onContact} />
        </div>
      );
    case 'sold':
      return (
        <div className='flex margin-right-except-last'>
          <ContactCustomerButton title='Contact Seller' onClick={onContact} />
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
