import { FilteredCdsDateDatum, FilteredCdsDatum } from '../../../types';

export const getLastDateDatum = (
  d: FilteredCdsDatum | void,
): FilteredCdsDateDatum | null => {
  if (!d) {
    return null;
  }
  const dateArray = Object.keys(d.dates);
  const lastDate = dateArray[dateArray.length - 1];
  return d.dates[lastDate] || null;
};
