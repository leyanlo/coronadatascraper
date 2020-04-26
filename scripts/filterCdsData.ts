/* eslint-disable no-console */
import fs from 'fs';

import { DATA_FILE, FILTERED_DATA_FILE } from './constants';
import { CdsData, CdsDatum, FilteredCdsData, FilteredCdsDatum } from './types';

const filterDates = (dates: CdsDatum['dates']): CdsDatum['dates'] =>
  Object.keys(dates).reduce((acc, k) => {
    const { cases, deaths } = dates[k];
    // skip empty dates
    if (cases || Object.keys(acc).length) {
      acc[k] = {
        cases,
        deaths,
      };
    }
    return acc;
  }, {} as FilteredCdsDatum['dates']);

const filterData = (data: CdsData): FilteredCdsData =>
  Object.keys(data).reduce((acc, k) => {
    const { dates, coordinates, level, population } = data[k];
    const filteredDates = filterDates(dates);
    acc[k] = {
      dates: filteredDates,
      coordinates,
      level,
      population,
    };
    return acc;
  }, {} as FilteredCdsData);

const dataPath = `./static/${DATA_FILE}`;
const filteredDataPath = `./static/${FILTERED_DATA_FILE}`;

try {
  const data: CdsData = JSON.parse(
    (fs.readFileSync(dataPath) as unknown) as string,
  );

  fs.writeFileSync(filteredDataPath, JSON.stringify(filterData(data)));
  console.log(
    `Wrote filtered Corona Data Scraper data to ${filteredDataPath}.`,
  );
} catch (err) {
  if (err.message === `ENOENT: no such file or directory, open '${dataPath}'`) {
    console.error('Corona Data Scraper data not found.');
  } else {
    console.error(err.message);
  }
}
