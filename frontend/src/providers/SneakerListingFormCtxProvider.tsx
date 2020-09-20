import React, { useState, createContext, useContext, useEffect } from 'react';
import * as Yup from 'yup';

import { Sneaker, ListedProduct, SneakerCondition } from '../../../shared';
import { required, requiredPositiveNumber } from 'utils/yup';
import { getBrands, getSneakerNames, getColorways } from 'api/api';

export type SneakerListingFormStateType = Pick<
  Sneaker & ListedProduct,
  | 'name'
  | 'brand'
  | 'size'
  | 'colorway'
  | 'askingPrice'
  | 'description'
  | 'sizeSystem'
  | 'currencyCode'
  | 'prodCondition'
  | 'conditionRating'
>;

type SneakerListingFormValidationSchemaType = Yup.ObjectSchema<
  Omit<SneakerListingFormStateType, 'conditionRating'> | undefined
>;

type SneakerListingFormCtxType = {
  brandOptions: string[];
  sneakerNamesOptions: string[];
  colorwayOptions: string[];
  listingSneakerFormState: SneakerListingFormStateType;
  validationSchema: SneakerListingFormValidationSchemaType;
  onSubmit: (newState: SneakerListingFormStateType) => void;
};

const INIT_FORM_STATE: SneakerListingFormStateType = {
  name: '',
  brand: '',
  size: '',
  colorway: '',
  askingPrice: '',
  description: '',
  sizeSystem: '',
  currencyCode: '',
  prodCondition: '' as SneakerCondition,
  conditionRating: 10,
};

const sneakerListingFormValidationSchema: SneakerListingFormValidationSchemaType = Yup.object({
  name: required(),
  brand: required(),
  colorway: required(),
  currencyCode: required(),
  sizeSystem: required(),
  prodCondition: required() as Yup.Schema<SneakerCondition>,
  // TODO: minimum price of $20
  askingPrice: requiredPositiveNumber('Price'),
  // NOTE: should be between size 1 to 15 or something
  size: requiredPositiveNumber('Size'),
});

const INIT_CTX: SneakerListingFormCtxType = {
  brandOptions: [],
  sneakerNamesOptions: [],
  colorwayOptions: [],
  listingSneakerFormState: INIT_FORM_STATE,
  validationSchema: sneakerListingFormValidationSchema,
  onSubmit: () => {
    throw new Error('Must override onSubmit');
  },
};

const SneakerListingFormCtx = createContext(INIT_CTX);

export const useSneakerListingFormCtx = () => useContext(SneakerListingFormCtx);

const SneakerListingFormCtxProvider = (props: { children: React.ReactNode }) => {
  const [listingSneakerFormState, setListingSneakerFormState] = useState(INIT_FORM_STATE);

  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [sneakerNamesOptions, setSneakerNamesOptions] = useState<string[]>([]);
  const [colorwayOptions, setColorwayOptions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setBrandOptions((await getBrands()).map((b) => b.brand));
      setSneakerNamesOptions((await getSneakerNames()).map((sn) => sn.name));
      setColorwayOptions((await getColorways()).map((c) => c.colorway));
    })();
  }, []);

  const onSubmit = (newState: SneakerListingFormStateType) => setListingSneakerFormState(newState);

  return (
    <SneakerListingFormCtx.Provider
      value={{
        brandOptions,
        colorwayOptions,
        sneakerNamesOptions,
        listingSneakerFormState,
        onSubmit,
        validationSchema: sneakerListingFormValidationSchema,
      }}
    >
      {props.children}
    </SneakerListingFormCtx.Provider>
  );
};

export default SneakerListingFormCtxProvider;
