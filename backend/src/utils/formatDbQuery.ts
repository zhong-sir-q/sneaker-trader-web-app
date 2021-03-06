type QueryObject = { [key: string]: any };

// the keys of the object will be the columns in the corresponding database
export const formatColumns = (obj: QueryObject) => {
  const columns = Object.keys(obj);

  return columns.join(', ');
};

export const doubleQuotedValue = (s: string) => `"${s}"`;

export const doubleQuotedValues = (obj: QueryObject) => {
  const values = Object.values(obj);
  // only add double quotes around the values that do not have the type of string
  const doubleQuoteVals = values.map((val) => (typeof val === 'number' ? val : doubleQuotedValue(val!)));

  return doubleQuoteVals;
};

export const formatInsertRowsQuery = (tableName: string, obj: QueryObject) =>
  `INSERT INTO ${tableName} (${formatColumns(obj)}) VALUES (${doubleQuotedValues(obj).join(', ')})`;

// output look likes, key_one = val_one, key_two = val_two ...,
// where the value should be double quoted if it is not a number
export const formatSetQuery = (obj: QueryObject) => {
  const doubleQuoteVals = doubleQuotedValues(obj);
  let output = '';
  const length = Object.keys(obj).length;

  Object.keys(obj).forEach((column, idx) => {
    const end = idx < length - 1 ? ', ' : '';
    const temp = column + '=' + doubleQuoteVals[idx] + end;
    output += temp;
  });

  return output;
};

// condition is the WHERE statement
export const formatUpdateRowsQuery = (tableName: string, obj: QueryObject, condition: string) =>
  `UPDATE ${tableName} SET ${formatSetQuery(obj)} WHERE ${condition}`;

export const formatGetRowsQuery = (tableName: string, condition?: string) =>
  condition ? `SELECT * FROM ${tableName} WHERE ${condition}` : `SELECT * FROM ${tableName}`;

export const formatDeleteQuery = (tableName: string, condition: string) => `DELETE FROM ${tableName} WHERE ${condition}`
