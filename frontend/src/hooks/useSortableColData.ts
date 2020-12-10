import React from 'react';

type SortConfigType = { key: string; direction: string } | undefined;

type UseSortableColDataReturnType<T> = {
  sortedItems: T[];
  sortConfig: SortConfigType;
  requestSort: (key: string) => void;
  getHeaderClassName: (name: string) => string | undefined;
};

const getNested = (theObject: any, path: string, separator?: string) => {
  try {
    separator = separator || '.';

    return path
      .replace('[', separator)
      .replace(']', '')
      .split(separator)
      .reduce(function (obj, property) {
        return obj[property];
      }, theObject);
  } catch (err) {
    return undefined;
  }
};

const useSortableColData = <T>(
  items: (T | any)[],
  config: SortConfigType = undefined
): UseSortableColDataReturnType<T> => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    const sortableItems = [...items];

    if (sortConfig) {
      sortableItems.sort((a, b) => {
        // most of the time, the object is 1d, getNested deals
        // with cases if I am trying to access deeply nested objects
        if (getNested(a, sortConfig.key) < getNested(b, sortConfig.key))
          return sortConfig.direction === 'ascending' ? -1 : 1;
        if (getNested(a, sortConfig.key) > getNested(b, sortConfig.key))
          return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'ascending';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';

    setSortConfig({ key, direction });
  };

  const getHeaderClassName = (name: string) => {
    if (!sortConfig) return;

    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return { sortedItems, sortConfig, requestSort, getHeaderClassName };
};

export default useSortableColData;
