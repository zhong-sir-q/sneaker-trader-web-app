import * as Yup from 'yup';
import moment from 'moment';
import UserControllerInstance from 'api/controllers/UserController';

const REQUIRED = '* Required';
const DATE_FORMAT = 'MM/DD/YYYY';

export const minCharacters = (limit: number) =>
  Yup.string().min(limit, `Must be at least ${limit} characters`).required(REQUIRED);

export const maxCharacters = (limit: number) =>
  Yup.string().max(limit, `Must be ${limit} characters or less`).required(REQUIRED);

export const required = () => Yup.string().required(REQUIRED);

export const customRequired = (message: string) => Yup.string().required(message);

export const validEmail = () => Yup.string().email('Invalid email address').required(REQUIRED);

export const validDate = () =>
  Yup.string()
    .required(REQUIRED)
    .test('valid-date', 'Invalid date format', (datevalue) => moment(datevalue, DATE_FORMAT, true).isValid());

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

export const checkDuplicateUsername = () =>
  Yup.string()
    .test('check duplicate user name in db', 'Username is chosen', async (username) => {
      if (!username) return true;
      const user = await UserControllerInstance.getByUsername(username);
      if (user) return false;
      return true;
    })
    .required(REQUIRED);

export const noSpecialChar = () =>
  Yup.string()
    .matches(/^[a-zA-Z0-9\s]+$/, 'No special characters')
    .required(REQUIRED);

export const minNumber = (lowerLim: number, msg: string) => Yup.number().min(lowerLim, msg).required(REQUIRED);
export const allowedRange = (lo: number, hi: number) => Yup.number().min(lo).max(hi).required(REQUIRED);
