import * as Yup from 'yup';
import moment from 'moment';

const REQUIRED = '* Required';
const DATE_FORMAT = 'MM/DD/YYYY';

export const minCharacters = (limit: number) => Yup.string().min(limit, `Must be at least ${limit} characters`).required(REQUIRED);
export const maxCharacters = (limit: number) => Yup.string().max(limit, `Must be ${limit} characters or less`).required(REQUIRED);
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
