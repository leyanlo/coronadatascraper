import { FilteredCdsDateDatum, FilteredCdsDatum } from '../../../scripts/types';

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

export const lerp = (v0: number[], v1: number[], t: number): number[] =>
  v0.map((v, i) => (v * (1 - t) + v1[i]) * t);
