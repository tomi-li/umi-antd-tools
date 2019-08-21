export default from './SearchHeader';
export Group from './Group';
export TimeRange from './TimeRange';
export Date from './Date';
export NumberRange from './NumberRange';
export CombineSearch from './CombineSearch';
export CheckboxGroup from './CheckboxGroup';
export SearchWithSelect from './SearchWithSelect';
export SortBy from './SortBy';

export const getFieldNameByKey = key => {
  return key.split('|')[0];
};
