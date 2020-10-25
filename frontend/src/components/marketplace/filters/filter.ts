// contains type definition for filter components

export type FilterButtonProps = { selected: boolean };

export type FilterByKey = 'brand' | 'size';

export type FiltersProps = {
  filters: string[];
  filterKey: FilterByKey;
  title: string;
};
