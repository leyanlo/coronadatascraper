import fs from 'fs';

import { DATA_PATH, FILTERED_DATA_PATH } from './constants';
import { CdsData, CdsDatum, FilteredCdsData, FilteredCdsDatum } from './types';

const filterDates = (dates: CdsDatum['dates']): CdsDatum['dates'] =>
  Object.keys(dates).reduce((acc, k) => {
    const { cases, deaths } = dates[k];
    // skip empty dates if acc is empty
    if (!cases && !deaths) {
      return acc;
    }

    acc[k] = {
      cases,
      deaths,
    };
    return acc;
  }, {} as FilteredCdsDatum['dates']);

const filterData = (data: CdsData): FilteredCdsData =>
  Object.keys(data).reduce((acc, k) => {
    const { dates, coordinates, level, population } = data[k];
    // skip location if no coordinates
    if (!coordinates) {
      return acc;
    }

    const filteredDates = filterDates(dates);
    acc[k] = {
      dates: filteredDates,
      coordinates,
      level,
      population,
    };
    return acc;
  }, {} as FilteredCdsData);

const filterCdsData = (): void => {
  try {
    const data: CdsData = JSON.parse(
      (fs.readFileSync(DATA_PATH) as unknown) as string,
    );

    fs.writeFileSync(FILTERED_DATA_PATH, JSON.stringify(filterData(data)));
    console.log(
      `Wrote filtered Corona Data Scraper data to ${FILTERED_DATA_PATH}.`,
    );
  } catch (err) {
    if (
      err.message === `ENOENT: no such file or directory, open '${DATA_PATH}'`
    ) {
      console.error('Corona Data Scraper data not found.');
    } else {
      console.error(err.message);
    }
  }
};
export default filterCdsData;
