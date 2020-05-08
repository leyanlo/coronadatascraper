import { FilteredCdsDateDatum, FilteredCdsDatum } from '../../../scripts/types';
import { COLOR_RANGE } from './constants';

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

export const getColor = (count: number | void): number[] =>
  !count ? [255, 255, 255] : COLOR_RANGE[Math.min(5, ~~Math.log10(count))];
