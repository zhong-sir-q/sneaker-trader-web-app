// the keys of the object will be the columns in the corresponding database
export const formatColumns = (obj: { [key: string]: string | number }) => {
    const columns = Object.keys(obj);
  
    return columns.join(', ');
  };
  
  export const formatValues = (obj: { [key: string]: string | number }) => {
    const values = Object.values(obj);
    // only add double quotes around the values that do not have the type of string
    const doubleQuoteVals = values.map((val) => (typeof val == 'string' ? `"${val}"` : val));
  
    return doubleQuoteVals.join(', ');
  };
  
  export const formatInsertAllColumnsQuery = (tableName: string, obj: { [key: string]: string | number }) =>
    `insert into ${tableName} (${formatColumns(obj)}) values (${formatValues(obj)})`;
