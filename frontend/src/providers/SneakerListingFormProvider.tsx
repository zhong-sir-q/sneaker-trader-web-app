import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import WalletControllerInstance from 'api/controllers/WalletController';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import checkUserWalletBalance from 'usecases/checkUserWalletBalance';
import { allowedRange, minNumber, noSpecialChar, required } from 'utils/yup';
import * as Yup from 'yup';
import { ListedProduct, Sneaker, SneakerCondition } from '../../../shared';
import { useAuth } from './AuthProvider';

export type SneakerListingFormStateType = Pick<
  Sneaker & ListedProduct,
  'name' | 'brand' | 'colorway' | 'description' | 'sizeSystem' | 'currencyCode' | 'prodCondition' | 'conditionRating'
> & { size: string; originalPurchasePrice: string; askingPrice: string };

type SneakerListingFormCtxType = {
  brandOptions: string[];
  sneakerNamesOptions: string[];
  colorwayOptions: string[];
  listingSneakerFormState: SneakerListingFormStateType;
  validationSchema: Yup.ObjectSchema;
  onSubmit: (newState: SneakerListingFormStateType) => void;
};

export const INIT_LISTING_FORM_STATE_VALUES: SneakerListingFormStateType = {
  name: '',
  brand: '',
  size: '',
  colorway: '',
  askingPrice: '',
  description: '',
  originalPurchasePrice: '',
  sizeSystem: 'US',
  currencyCode: 'NZD',
  prodCondition: '' as SneakerCondition,
  conditionRating: 5,
};

const sneakerListingFormValidationSchema = Yup.object({
  name: noSpecialChar(),
  brand: noSpecialChar(),
  colorway: noSpecialChar(),
  currencyCode: required(),
  sizeSystem: required(),
  prodCondition: required() as Yup.Schema<SneakerCondition>,
  askingPrice: minNumber(20, 'Minimum $20'),
  size: allowedRange(1, 15),
  originalPurchasePrice: minNumber(1, 'Minimum $1'),
});

export const INIT_LISTING_FORM_CTX: SneakerListingFormCtxType = {
  brandOptions: [],
  sneakerNamesOptions: [],
  colorwayOptions: [],
  listingSneakerFormState: INIT_LISTING_FORM_STATE_VALUES,
  validationSchema: sneakerListingFormValidationSchema,
  onSubmit: () => {
    throw new Error('Must override onSubmit');
  },
};

export const SneakerListingFormCtx = createContext(INIT_LISTING_FORM_CTX);

export const useSneakerListingFormCtx = () => useContext(SneakerListingFormCtx);

const SneakerListingFormProvider = (props: { children: React.ReactNode }) => {
  const [listingSneakerFormState, setListingSneakerFormState] = useState(INIT_LISTING_FORM_STATE_VALUES);

  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [sneakerNamesOptions, setSneakerNamesOptions] = useState<string[]>([]);
  const [colorwayOptions, setColorwayOptions] = useState<string[]>([]);

  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const isWalletBalancePositive = await checkUserWalletBalance(WalletControllerInstance, currentUser.id);

        if (!isWalletBalancePositive) return;

        setBrandOptions(await HelperInfoControllerInstance.getBrands());
        setSneakerNamesOptions(await HelperInfoControllerInstance.getSneakerNames());
        setColorwayOptions(await HelperInfoControllerInstance.getColorways());
      })();
    }
  }, [currentUser, history]);

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

export default SneakerListingFormProvider;
