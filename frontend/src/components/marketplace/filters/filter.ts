// contains type definition for filter components

export type FilterButtonProps = { selected: boolean };

export type FilterByKey = 'brand' | 'size';

type SelectFilterHandler = (filterKey: FilterByKey, filter: string) => void;

type FilterSelectedFunc = (filterVal: string) => boolean;

export type FiltersProps = {
  filters: string[];
  filterKey: FilterByKey;
  title: string;
  onSelectFilter: SelectFilterHandler;
  filterSelected: FilterSelectedFunc;
};
