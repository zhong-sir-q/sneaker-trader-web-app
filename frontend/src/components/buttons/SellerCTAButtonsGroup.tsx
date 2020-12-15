import React, { useState } from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';
import RemoveListingButton from './RemoveListingButton';
import { CompleteSaleButton } from './StyledButton';

import { SneakerStatus, Buyer } from '../../../../shared';
import TransactionControllerInstance from 'api/controllers/TransactionController';

type SellerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  userId: number;
  buyer: Buyer;
  productId: number;
  onCompleteSale: () => void;
  onRemoveListing: () => void;
  onContact: () => void;
};

const SellerCTAButtonsGroup = (props: SellerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, buyer, onContact, onCompleteSale, onRemoveListing } = props;

  // DIRTY TRICK: update the state after the rating is completed to hide the RateCustomer
  // button, if this state is not used, I have to tell the parent to fetch all data in order to update
  // which will be very slow
  const [hasSellerRatedBuyer, setHasSellerRatedBuyer] = useState(buyer ? buyer.hasSellerRatedBuyer : 0);

  const onCompleteRating = async (listedProductId: number, rating: number, comment: string) => {
    await TransactionControllerInstance.rateBuyer(listedProductId, rating, comment);
    setHasSellerRatedBuyer(1);
  };

  const render = () => {
    switch (prodStatus) {
      case 'listed':
        return (
          <RemoveListingButton listedProdId={listedProdId} title='Remove Listing' onConfirmRemove={onRemoveListing} />
        );
      case 'pending':
        return (
          <>
            <ContactCustomerButton title='Contact Buyer' onClick={onContact} />
            <CompleteSaleButton onClick={onCompleteSale}>Complete Sale</CompleteSaleButton>
          </>
        );
      case 'sold':
        return (
          <>
            <ContactCustomerButton title='Contact Buyer' onClick={onContact} />
            {!hasSellerRatedBuyer && (
              <RateCustomer title='Rate Buyer' listedProductId={listedProdId} rateUser={onCompleteRating} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return <div className='flex margin-right-except-last'>{render()}</div>;
};

export default SellerCTAButtonsGroup;
