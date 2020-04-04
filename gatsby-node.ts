/* eslint-disable no-console */
import fs from 'fs';
import { GatsbyNode } from 'gatsby';
import fetch from 'node-fetch';

import { DATA_FILE, FILTERED_DATA_FILE } from './constants';
import { CdsData, CdsDatum, FilteredCdsData, FilteredCdsDatum } from './types';

const filterDates = (dates: CdsDatum['dates']): CdsDatum['dates'] =>
  Object.keys(dates).reduce((acc, k) => {
    const { cases, deaths } = dates[k];
    acc[k] = {
      cases,
      deaths,
    };
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

// eslint-disable-next-line import/prefer-default-export
export const onPreInit: GatsbyNode['onPreInit'] = async () => {
  const dataPath = `./static/${DATA_FILE}`;
  const filteredDataPath = `./static/${FILTERED_DATA_FILE}`;

  try {
    const data: CdsData = JSON.parse(
      (fs.readFileSync(filteredDataPath) as unknown) as string,
    );

    const maxDate = Object.keys(data).reduce((acc, k) => {
      const { dates } = data[k];
      return Math.max(
        acc,
        ...Object.keys(dates).map<number>(d => new Date(d).valueOf()),
      );
    }, 0);

    if (new Date().valueOf() - maxDate > 2 * 24 * 60 * 60 * 1000) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('Corona Data Scraper data more than one day old.');
    }
    console.log(
      'Corona Data Scraper data present and current.\nSkipping fetch.',
    );
  } catch (err) {
    if (
      err.message ===
      `ENOENT: no such file or directory, open '${filteredDataPath}'`
    ) {
      console.log('Corona Data Scraper data not found.');
    } else {
      console.log(err.message);
    }
    console.log('Fetching new Corona Data Scraper data.');
    await fetch(`https://coronadatascraper.com/${DATA_FILE}`)
      .then(res => res.json())
      .then((data: CdsData) => {
        fs.writeFileSync(dataPath, JSON.stringify(data));
        console.log(`Wrote Corona Data Scraper data to ${dataPath}.`);

        fs.writeFileSync(filteredDataPath, JSON.stringify(filterData(data)));
        console.log(
          `Wrote filtered Corona Data Scraper data to ${filteredDataPath}.`,
        );
      });
  }
};
