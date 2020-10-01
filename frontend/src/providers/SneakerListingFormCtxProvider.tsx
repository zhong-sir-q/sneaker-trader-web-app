import React, { useState, createContext, useContext, useEffect } from 'react';
import * as Yup from 'yup';

import { Sneaker, ListedProduct, SneakerCondition } from '../../../shared';
import { required, noSpecialChar, minNumber, allowedRange } from 'utils/yup';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';

export type SneakerListingFormStateType = Pick<
  Sneaker & ListedProduct,
  'name' | 'brand' | 'colorway' | 'description' | 'sizeSystem' | 'currencyCode' | 'prodCondition' | 'conditionRating'
> & { size: number | ''; askingPrice: number | '' };

type SneakerListingFormValidationSchemaType = Yup.ObjectSchema<
  Omit<SneakerListingFormStateType, 'conditionRating' | 'description'> | undefined
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
  name: noSpecialChar(),
  brand: noSpecialChar(),
  colorway: noSpecialChar(),
  currencyCode: required(),
  sizeSystem: required(),
  prodCondition: required() as Yup.Schema<SneakerCondition>,
  askingPrice: minNumber(20, 'Minimum $20'),
  size: allowedRange(1, 15),
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
      setBrandOptions(await HelperInfoControllerInstance.getBrands())
      setSneakerNamesOptions(await HelperInfoControllerInstance.getSneakerNames())
      setColorwayOptions(await HelperInfoControllerInstance.getColorways())
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
