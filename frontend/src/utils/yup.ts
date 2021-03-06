import * as Yup from 'yup';
import moment from 'moment';

import UserControllerInstance from 'api/controllers/UserController';
import { upperCaseFirstLetter } from './utils';

const REQUIRED = '* Required';

export const minCharacters = (limit: number) =>
  Yup.string().min(limit, `Must be at least ${limit} characters`).required(REQUIRED);

export const maxCharacters = (limit: number) =>
  Yup.string().max(limit, `Must be ${limit} characters or less`).required(REQUIRED);

export const equalDigits = (digits: number) =>
  Yup.number().test('len', 'Must be exactly 4 digits', (val) => {
    if (val) return val.toString().length === digits;
    return false;
  });

export const required = (fieldName?: string) =>
  Yup.string().required(fieldName ? `${upperCaseFirstLetter(fieldName)} is required` : REQUIRED);

export const customRequired = (message: string) => Yup.string().required(message);

export const validEmail = () => Yup.string().email('Invalid email address').required(REQUIRED);

export const validDate = (dateFormat: string) =>
  Yup.string()
    .required(REQUIRED)
    .test('valid-date', `Date format should be: ${dateFormat}`, (datevalue) =>
      moment(datevalue, dateFormat, true).isValid()
    );

export const matchingPassword = (pwFieldName: string) =>
  Yup.string()
    .oneOf([Yup.ref(pwFieldName)], 'Password must match')
    .required(REQUIRED);

export const requiredPositiveNumber = (fieldName: string) =>
  Yup.number()
    .typeError(`${fieldName} must be a number`)
    .positive(`${fieldName} must be greater than zero`)
    .required(`${fieldName} is Required`);

// the val !== undefined check here is necessary otherwise the web will become errorenous
export const validPhoneNo = () =>
  Yup.string()
    .matches(/^[0-9]+/, 'Must be all digits')
    .test(
      'len',
      'Should be between 8-10 digits long',
      (val) => val !== undefined && val!.length >= 8 && val!.length <= 10
    );

export const checkDuplicateUsername = (userId?: number) =>
  Yup.string()
    .test('check duplicate user name in db', 'Username is chosen', async (username) => {
      if (!username) return true;

      const user = await UserControllerInstance.getByUsername(username);

      // the username is duplicate
      if (user && user.id !== userId) return false;

      return true;
    })
    .required(REQUIRED);

export const noSpecialChar = () =>
  Yup.string()
    .matches(/^[a-zA-Z0-9.-\s]+$/, 'No special characters')
    .required(REQUIRED);

export const minNumber = (lowerLim: number, message: string) => Yup.number().min(lowerLim, message);
export const allowedRange = (lo: number, hi: number) => Yup.number().min(lo).max(hi);
