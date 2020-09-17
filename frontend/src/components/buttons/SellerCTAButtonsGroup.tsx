import React from 'react';

import RateCustomer from 'components/RateCustomer';
import ContactCustomerButton from './ContactCustomerButton';
import { CompleteSaleButton } from './StyledButton';

import { rateBuyer } from 'api/api';
import { SneakerStatus, Customer } from '../../../../shared';

type SellerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus;
  listedProdId: number;
  buyer: Customer;
  onCompleteSale: () => void;
};

const SellerCTAButtonsGroup = (props: SellerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, buyer, onCompleteSale } = props;

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
          <RateCustomer title='Rate Buyer' listedProductId={listedProdId} rateUser={rateBuyer} />
        </div>
      );
    default:
      return null;
  }
};

export default SellerCTAButtonsGroup;
