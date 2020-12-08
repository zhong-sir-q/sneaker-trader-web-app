import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';
import WalletControllerInstance from 'api/controllers/WalletController';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import checkUserWalletBalance from 'usecases/checkUserWalletBalance';
import { allowedRange, minNumber, noSpecialChar, required } from 'utils/yup';
import * as Yup from 'yup';
import { ListedProduct, Sneaker, SneakerCondition } from '../../../shared';
import { useAuth } from './AuthProvider';

// string | number so the type becomes compatible in EditListedSneakerPage
export type SneakerListingFormStateType = Pick<
  Sneaker & ListedProduct,
  'name' | 'brand' | 'colorway' | 'description' | 'sizeSystem' | 'currencyCode' | 'prodCondition' | 'conditionRating'
> & { size: string | number; originalPurchasePrice: string | number; askingPrice: string | number };

type SneakerListingFormCtxType = {
  brandOptions: string[];
  sneakerNamesOptions: string[];
  colorwayOptions: string[];
  listingSneakerFormState: SneakerListingFormStateType;
  validationSchema: Yup.ObjectSchema;
  updateFormState: (newState: SneakerListingFormStateType) => void;
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
  currencyCode: required('currency code'),
  sizeSystem: required('size system'),
  prodCondition: required('product condition') as Yup.Schema<SneakerCondition>,
  askingPrice: minNumber(20, 'Minimum $20').required('Asking price is required'),
  size: allowedRange(1, 15).required('Size is required'),
  originalPurchasePrice: minNumber(1, 'Minimum $1').required('Original purchase price is required'),
});

export const INIT_LISTING_FORM_CTX: SneakerListingFormCtxType = {
  brandOptions: [],
  sneakerNamesOptions: [],
  colorwayOptions: [],
  listingSneakerFormState: INIT_LISTING_FORM_STATE_VALUES,
  validationSchema: sneakerListingFormValidationSchema,
  updateFormState: () => {
    throw new Error('Must override onSubmit');
  },
};

export const SneakerListingFormCtx = createContext(INIT_LISTING_FORM_CTX);

export const useSneakerListingFormCtx = () => useContext(SneakerListingFormCtx);

const SneakerListingFormProvider = (props: { children: React.ReactNode; formValues?: SneakerListingFormStateType }) => {
  const [listingSneakerFormState, setListingSneakerFormState] = useState(
    props.formValues || INIT_LISTING_FORM_STATE_VALUES
  );

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

  const updateFormState = (newState: SneakerListingFormStateType) => setListingSneakerFormState(newState);

  return (
    <SneakerListingFormCtx.Provider
      value={{
        brandOptions,
        colorwayOptions,
        sneakerNamesOptions,
        listingSneakerFormState,
        validationSchema: sneakerListingFormValidationSchema,
        updateFormState,
      }}
    >
      {props.children}
    </SneakerListingFormCtx.Provider>
  );
};

export default SneakerListingFormProvider;
