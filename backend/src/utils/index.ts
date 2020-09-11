// TODO: type guard to check the query must specify all columns that we have 
// in the database a simple check to make sure the request body is an object
export const hasValidBody = (req: any) => req.body && typeof req.body === 'object';

export const makeDeepCopy = (obj: { [key: string]: any }) => {
  const result: any = {};
  Object.keys(obj).forEach((k) => (result[k] = obj[k]));

  return result;
};
