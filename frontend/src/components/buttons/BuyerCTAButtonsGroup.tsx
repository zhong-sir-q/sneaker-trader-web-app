import React from "react"

import RateCustomer from "components/RateCustomer";
import ContactCustomerButton from "./ContactCustomerButton";

import { rateSeller } from "api/api";
import { SneakerStatus, Customer } from "../../../../shared";

type BuyerCTAButtonsGroupProps = {
  prodStatus: SneakerStatus
  listedProdId: number
  seller: Customer
}

const BuyerCTAButtonsGroup = (props: BuyerCTAButtonsGroupProps) => {
  const { prodStatus, listedProdId, seller } = props

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
          <RateCustomer title='Rate Buyer' listedProductId={listedProdId} rateUser={rateSeller} />
        </div>
      );
    default:
      return null;
  }
};

export default BuyerCTAButtonsGroup;
