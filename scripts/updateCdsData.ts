/* eslint-disable no-console */
import fs from 'fs';

import { DATA_PATH } from './constants';
import fetchCdsData from './fetchCdsData';
import filterCdsData from './filterCdsData';
import { CdsData } from './types';

const updateCdsData = async (): Promise<void> => {
  try {
    const data: CdsData = JSON.parse(
      (fs.readFileSync(DATA_PATH) as unknown) as string,
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
      err.message === `ENOENT: no such file or directory, open '${DATA_PATH}'`
    ) {
      console.log('Corona Data Scraper data not found.');
    } else {
      console.log(err.message);
    }
    console.log('Fetching new Corona Data Scraper data.');
    await fetchCdsData();
  }

  filterCdsData();
};
updateCdsData().then(() => console.log('Done.'));
