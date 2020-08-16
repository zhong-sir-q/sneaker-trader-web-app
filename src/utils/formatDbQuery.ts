type QueryObject = { [key: string]: string | number | undefined };

// the keys of the object will be the columns in the corresponding database
export const formatColumns = (obj: QueryObject) => {
  const columns = Object.keys(obj);

  return columns.join(', ');
};

export const formatValues = (obj: QueryObject) => {
  const values = Object.values(obj);
  // only add double quotes around the values that do not have the type of string
  const doubleQuoteVals = values.map((val) => (typeof val === 'string' || typeof val === 'undefined' ? `"${val}"` : val));

  return doubleQuoteVals.join(', ');
};

export const formatInsertAllColumnsQuery = (tableName: string, obj: QueryObject) =>
  `insert into ${tableName} (${formatColumns(obj)}) values (${formatValues(obj)})`;
